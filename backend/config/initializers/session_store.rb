Rails.application.config.session_store(:cookie_store,
  key: '_pa_leva_session',
  domain: :all,
  same_site: :none,
  secure: true,
  tld_length: 2
)
