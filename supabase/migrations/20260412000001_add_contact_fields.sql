alter table responses add column if not exists consent_recontact text;
alter table responses add column if not exists email text;
alter table responses add column if not exists rgpd_consent text;
