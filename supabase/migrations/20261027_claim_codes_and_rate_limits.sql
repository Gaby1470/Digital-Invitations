CREATE TABLE public.invitation_claims (
  invitation_id uuid PRIMARY KEY REFERENCES public.invitations(id) ON DELETE CASCADE,
  claim_code text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.invitation_claims (invitation_id, claim_code)
SELECT id, claim_code
FROM public.invitations
WHERE claim_code IS NOT NULL
ON CONFLICT (invitation_id) DO NOTHING;

ALTER TABLE public.invitations DROP COLUMN IF EXISTS claim_code;

ALTER TABLE public.invitation_claims ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.invitation_claims FROM anon, authenticated;
GRANT ALL ON public.invitation_claims TO service_role;

CREATE OR REPLACE FUNCTION public.claim_invitation_by_code(p_code text, p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  target public.invitations%ROWTYPE;
BEGIN
  SELECT i.* INTO target
  FROM public.invitation_claims c
  JOIN public.invitations i ON i.id = c.invitation_id
  WHERE c.claim_code = upper(trim(p_code))
  FOR UPDATE OF c, i;

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  IF target.user_id = p_user_id THEN
    RETURN jsonb_build_object('error', 'already_owned');
  END IF;

  UPDATE public.invitations
  SET user_id = p_user_id, is_custom_design = true
  WHERE id = target.id
  RETURNING * INTO target;

  DELETE FROM public.invitation_claims WHERE invitation_id = target.id;
  RETURN to_jsonb(target);
END;
$$;

REVOKE ALL ON FUNCTION public.claim_invitation_by_code(text, uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_invitation_by_code(text, uuid) TO service_role;

CREATE TABLE public.api_rate_limits (
  bucket_key text NOT NULL,
  window_start timestamptz NOT NULL,
  request_count integer NOT NULL,
  PRIMARY KEY (bucket_key, window_start)
);

CREATE INDEX api_rate_limits_window_start_idx ON public.api_rate_limits (window_start);
ALTER TABLE public.api_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.api_rate_limits FROM anon, authenticated;
GRANT ALL ON public.api_rate_limits TO service_role;

CREATE OR REPLACE FUNCTION public.consume_api_rate_limit(
  p_bucket_key text,
  p_limit integer,
  p_window_seconds integer
)
RETURNS TABLE (allowed boolean, retry_after integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  current_window timestamptz;
  current_count integer;
BEGIN
  IF p_limit < 1 OR p_window_seconds < 1 THEN
    RAISE EXCEPTION 'Rate limit and window must be positive';
  END IF;

  current_window := to_timestamp(
    floor(extract(epoch FROM now()) / p_window_seconds) * p_window_seconds
  );

  DELETE FROM public.api_rate_limits
  WHERE window_start < now() - interval '1 day';

  INSERT INTO public.api_rate_limits (bucket_key, window_start, request_count)
  VALUES (p_bucket_key, current_window, 1)
  ON CONFLICT (bucket_key, window_start)
  DO UPDATE SET request_count = public.api_rate_limits.request_count + 1
  RETURNING public.api_rate_limits.request_count INTO current_count;

  RETURN QUERY SELECT
    current_count <= p_limit,
    greatest(1, ceil(extract(epoch FROM current_window + make_interval(secs => p_window_seconds) - now()))::integer);
END;
$$;

REVOKE ALL ON FUNCTION public.consume_api_rate_limit(text, integer, integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_api_rate_limit(text, integer, integer) TO service_role;