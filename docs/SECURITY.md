# Website Security Plan

> A comprehensive, layered security plan for hardening a website against all major attacks, threats, and bugs.
> Structured for implementation by an AI coding agent.

---

## Table of Contents

1. [Layer 1 — Network & Infrastructure](#layer-1--network--infrastructure)
2. [Layer 2 — Application Security](#layer-2--application-security)
3. [Layer 3 — Data Security](#layer-3--data-security)
4. [Layer 4 — Server & Infrastructure Hardening](#layer-4--server--infrastructure-hardening)
5. [Layer 5 — Monitoring, Detection & Response](#layer-5--monitoring-detection--response)
6. [Ongoing Practices](#ongoing-practices)
7. [Attack Reference Checklist](#attack-reference-checklist)

---

## Layer 1 — Network & Infrastructure

### 1.1 Web Application Firewall (WAF)

- Deploy a WAF in front of all public-facing services (e.g., Cloudflare WAF, AWS WAF, ModSecurity, or Nginx + naxsi).
- Enable rulesets that block:
  - SQL injection (SQLi)
  - Cross-site scripting (XSS)
  - Path traversal (`../../etc/passwd`)
  - Remote file inclusion (RFI)
  - Local file inclusion (LFI)
  - XML external entity injection (XXE)
  - Server-side request forgery (SSRF)
  - Command injection
- Set WAF to **block mode** (not just detect/log).
- Whitelist known-good IP ranges for admin panels.

### 1.2 DDoS Protection

- Enable volumetric DDoS mitigation at the CDN/edge layer (Cloudflare, AWS Shield, or Akamai).
- Implement **rate limiting** per IP and per user:
  - General pages: 100 req/min per IP
  - Login endpoint: 5 req/min per IP
  - API endpoints: 60 req/min per token
- Use CAPTCHA/challenge pages for suspicious traffic spikes.
- Enable traffic scrubbing for UDP/TCP flood protection.
- Set connection limits per IP at the load balancer level.

### 1.3 TLS / HTTPS

- Enforce **TLS 1.3** (disable TLS 1.0, 1.1, and weak cipher suites).
- Redirect all HTTP traffic to HTTPS (301 permanent redirect).
- Set **HTTP Strict Transport Security (HSTS)** header:
  ```
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  ```
- Submit the domain to the [HSTS Preload List](https://hstspreload.org/).
- Use strong certificate key sizes (RSA 2048+ or ECDSA P-256).
- Automate certificate renewal (Let's Encrypt + Certbot or ACM).
- Enable **OCSP stapling** on the web server.
- Eliminate all mixed HTTP/HTTPS content on pages.

### 1.4 DNS Security

- Enable **DNSSEC** on the domain.
- Set SPF, DKIM, and DMARC records to prevent email spoofing.
- Use `CAA` DNS records to restrict which CAs can issue certificates.
- Disable unnecessary DNS records (wildcards, old subdomains).

---

## Layer 2 — Application Security

### 2.1 Input Validation & Output Encoding

- **Never trust user input** — validate everything server-side, regardless of client-side checks.
- Apply an allowlist (not blocklist) approach for accepted input formats.
- Validate:
  - Data type (string, integer, email, date)
  - Length (min/max)
  - Format (regex where appropriate)
  - Range (for numbers)
- **SQL injection prevention:**
  - Use parameterized queries / prepared statements exclusively.
  - Never concatenate user input into SQL strings.
  - Use an ORM with safe query building.
  - Disable detailed database error messages in production.
- **XSS prevention:**
  - HTML-encode all output rendered in the browser.
  - Use context-aware escaping (HTML, JavaScript, CSS, URL contexts are different).
  - Set `Content-Type: text/html; charset=UTF-8` on all responses.
  - Never use `innerHTML`, `eval()`, or `document.write()` with user data.
- **Command injection prevention:**
  - Never pass user input to shell commands.
  - Use language-native libraries instead of shell exec functions.
- **XXE prevention:**
  - Disable external entity processing in XML parsers.
  - Use JSON instead of XML where possible.

### 2.2 Authentication & Session Management

- Enforce **multi-factor authentication (MFA)** for all accounts, mandatory for admin roles.
- Implement account lockout after 5 failed login attempts (with exponential backoff).
- Use secure password policies:
  - Minimum 12 characters
  - Check against known breached password lists (HaveIBeenPwned API)
  - Do not restrict special characters
- Cookie security flags — all session cookies must have:
  ```
  Set-Cookie: session=...; HttpOnly; Secure; SameSite=Strict; Path=/
  ```
- Session management:
  - Generate new session ID on login (session fixation prevention).
  - Expire sessions after 15–30 minutes of inactivity.
  - Provide explicit logout that destroys the server-side session.
  - Invalidate all sessions on password change.
- Do not expose session IDs in URLs.
- Store session data server-side only (not in cookies or localStorage).

### 2.3 CSRF Protection

- Generate a cryptographically random **CSRF token** per user session.
- Include the token in every state-changing form (POST, PUT, DELETE, PATCH).
- Validate the token server-side on every such request.
- For SPAs/APIs using CORS, use the **Double Submit Cookie** or **custom request header** pattern.
- Set `SameSite=Strict` or `SameSite=Lax` on all cookies as an additional layer.

### 2.4 Clickjacking Protection

- Set the following HTTP headers on all responses:
  ```
  X-Frame-Options: DENY
  Content-Security-Policy: frame-ancestors 'none';
  ```
- Only allow framing from trusted origins if embedding is intentional.

### 2.5 Content Security Policy (CSP)

- Implement a strict CSP header. Example starting policy:
  ```
  Content-Security-Policy:
    default-src 'self';
    script-src 'self' 'nonce-{random}';
    style-src 'self' 'nonce-{random}';
    img-src 'self' data: https:;
    font-src 'self';
    connect-src 'self' https://api.yourdomain.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
    upgrade-insecure-requests;
  ```
- Use **nonces** (not `unsafe-inline`) for inline scripts and styles.
- Enable CSP in **report-only mode** first, then enforce after validating.
- Set up a CSP violation report endpoint.

### 2.6 Access Control

- Implement **Role-Based Access Control (RBAC)** or Attribute-Based Access Control (ABAC).
- Apply the **principle of least privilege** — users and services get only the permissions they need.
- Enforce authorization checks **server-side** on every request — never rely on client-side UI to hide features.
- Check object-level authorization (IDOR prevention): verify the requesting user owns the resource being accessed.
- Deny access by default; explicitly grant permissions.
- Separate admin interfaces from public-facing ones (different subdomain, IP restriction).

### 2.7 File Upload Security

- Validate file type **server-side** using magic bytes (not just file extension or MIME type from the request).
- Maintain an allowlist of permitted file types.
- Enforce maximum file size limits.
- Rename uploaded files to a random UUID — never use the original filename.
- Store uploaded files **outside the webroot** (not accessible directly via URL).
- Serve uploads through a dedicated endpoint that sets:
  ```
  Content-Disposition: attachment
  X-Content-Type-Options: nosniff
  Content-Type: application/octet-stream
  ```
- Scan uploaded files with an antivirus/malware scanner before making them available.
- Strip EXIF/metadata from images.

### 2.8 API Security

- Authenticate every API endpoint — no unauthenticated endpoints unless explicitly public.
- Use **OAuth 2.0 with PKCE** for user-facing flows; signed **JWTs** (RS256 or ES256) for service-to-service.
- Validate JWT signature, expiry (`exp`), issuer (`iss`), and audience (`aud`) on every request.
- Validate request and response schemas against an OpenAPI/JSON schema definition.
- Apply rate limiting per API key and per user.
- Never expose sensitive data in API responses — return only what the client needs.
- Disable verbose error messages in production; return generic error codes.
- Version your API and deprecate old versions securely.
- Implement **API key rotation** and revocation mechanisms.

### 2.9 Security HTTP Headers

Set these headers on every response:

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Cache-Control: no-store (for sensitive pages)
```

Remove server-identifying headers:
```
Server: (remove or set to a generic value)
X-Powered-By: (remove entirely)
```

### 2.10 Dependency & Third-Party Code

- Pin all dependencies to exact versions in a lock file (`package-lock.json`, `Pipfile.lock`, etc.).
- Enable automated dependency scanning (Dependabot, Snyk, or Renovate).
- Audit third-party JavaScript loaded from CDNs using **Subresource Integrity (SRI)**:
  ```html
  <script src="https://cdn.example.com/lib.js"
          integrity="sha384-..."
          crossorigin="anonymous"></script>
  ```
- Regularly review and remove unused dependencies.
- Avoid loading scripts from untrusted third-party domains.

---

## Layer 3 — Data Security

### 3.1 Encryption at Rest

- Encrypt all database storage using AES-256 (most managed databases offer this by default — verify it is enabled).
- Encrypt all backup files before storing them.
- Encrypt sensitive columns (PII, payment data) at the application level in addition to disk encryption.
- Use a **secrets manager** for all credentials and keys (HashiCorp Vault, AWS Secrets Manager, GCP Secret Manager):
  - No credentials in source code or `.env` files committed to version control.
  - Rotate secrets regularly and on suspected compromise.
  - Use short-lived credentials where possible.

### 3.2 Encryption in Transit (Internal)

- Enable TLS on all internal service-to-service communication (not just the public edge).
- Use mutual TLS (mTLS) for sensitive internal APIs.
- Encrypt connections to the database (e.g., `sslmode=require` in PostgreSQL).

### 3.3 Password Storage

- Hash all passwords with **Argon2id** (preferred) or **bcrypt** (work factor ≥ 12).
- Use a unique, random salt per password (automatically handled by Argon2/bcrypt).
- Never store, log, or transmit plaintext passwords.
- Never use MD5, SHA-1, or unsalted SHA-256 for password hashing.

### 3.4 PII & Sensitive Data Handling

- Collect only the minimum personal data necessary (data minimization).
- Mask or redact PII (emails, phone numbers, IDs) in all logs.
- Define and enforce data retention policies — delete data that is no longer needed.
- Comply with applicable regulations (GDPR, CCPA, HIPAA as relevant).

---

## Layer 4 — Server & Infrastructure Hardening

### 4.1 Patch Management

- Enable automatic security updates for the OS.
- Automate dependency vulnerability scanning in CI/CD (Snyk, Trivy, OWASP Dependency-Check).
- Subscribe to CVE feeds for frameworks, databases, and web servers in use.
- Define a patch SLA: critical CVEs patched within 24–48 hours, high within 7 days.

### 4.2 Firewall & Network Segmentation

- Apply an allowlist firewall policy — block all ports by default, open only what is required:
  - Public: 80 (redirect to 443), 443
  - SSH: non-standard port, restricted to known admin IPs only
  - Database: internal network only, never exposed to the internet
- Segment the network: web servers, application servers, and database servers in separate subnets.
- Use Security Groups or firewall rules to enforce segment boundaries.
- Disable IPv6 if not in use, or apply the same firewall rules to IPv6 interfaces.

### 4.3 SSH Hardening

- Disable password authentication — use **SSH key pairs only**.
- Disable root login over SSH (`PermitRootLogin no`).
- Use a non-standard SSH port.
- Restrict SSH access to admin IP allowlist.
- Use `fail2ban` or equivalent to auto-ban repeated failed SSH attempts.
- Rotate SSH keys regularly.

### 4.4 Container & Process Security

- Run all processes and containers as **non-root users**.
- Use read-only container filesystems where possible.
- Drop all unnecessary Linux capabilities (`--cap-drop=ALL`, add back only what is needed).
- Do not run privileged containers.
- Scan container images for vulnerabilities before deployment (Trivy, Docker Scout).
- Follow CIS benchmarks for Docker/Kubernetes.
- Use network policies in Kubernetes to restrict pod-to-pod communication.

### 4.5 Web Server Hardening

- Disable directory listing.
- Disable unused HTTP methods (TRACE, PUT, DELETE where not needed).
- Restrict access to hidden files and directories (`.git`, `.env`, `.htaccess`):
  ```nginx
  location ~ /\. { deny all; }
  ```
- Set appropriate `server_tokens off` (Nginx) or `ServerTokens Prod` (Apache) to hide version info.
- Set request size limits to prevent large payload attacks.
- Enable HTTP/2 (performance + security over HTTP/1.1).

### 4.6 Cloud & Infrastructure as Code

- Never hardcode credentials in Terraform, CloudFormation, or Helm charts.
- Enable cloud provider security services (AWS GuardDuty, GCP Security Command Center, Azure Defender).
- Apply the principle of least privilege to all IAM roles and service accounts.
- Enable MFA for all cloud console accounts.
- Enable CloudTrail / audit logging for all cloud API calls.
- Disable public access on storage buckets (S3, GCS) unless explicitly required.
- Enable versioning and MFA-delete on backup storage buckets.

---

## Layer 5 — Monitoring, Detection & Response

### 5.1 Logging

- Centralize logs in a SIEM or log aggregation platform (Elastic/Kibana, Splunk, Datadog, Loki).
- Log the following events:
  - Authentication events (success, failure, MFA events)
  - Authorization failures (403 responses)
  - Admin actions (user creation, permission changes, config changes)
  - All errors (4xx, 5xx responses)
  - File access and uploads
  - Input validation failures
  - Rate limit triggers
- Log format should include: timestamp (UTC), user ID, IP address, endpoint, HTTP method, status code, user agent.
- Store logs in **tamper-proof, write-once storage** (S3 Object Lock, immutable log buckets).
- Set log retention to at least 90 days (1 year for compliance-regulated systems).
- **Never log passwords, tokens, or PII.**

### 5.2 Alerting & Intrusion Detection

- Set up automated alerts for:
  - Repeated authentication failures (brute force detection)
  - Successful login from a new country/IP
  - Admin login outside of business hours
  - Sudden spike in 4xx or 5xx errors
  - WAF block rate spike
  - Database query anomalies
  - File system changes in sensitive directories
- Deploy an IDS/IPS (Suricata, Wazuh, AWS Inspector, or cloud-native equivalents).
- Consider deploying **honeypot endpoints** (e.g., `/admin-old`, `/phpmyadmin`) that generate alerts if accessed.

### 5.3 Vulnerability Scanning

- Run **automated DAST** (Dynamic Application Security Testing) on every deployment (OWASP ZAP, Burp Suite Enterprise).
- Run **SAST** (Static Application Security Testing) in CI/CD (Semgrep, SonarQube, Bandit).
- Run infrastructure vulnerability scans monthly (Nessus, Qualys, or cloud-native scanners).
- Conduct a **manual penetration test** at least once a year, or after major architecture changes.
- Implement a **bug bounty program** (HackerOne, Bugcrowd) for continuous external coverage.

### 5.4 Backups & Disaster Recovery

- Take automated daily encrypted backups of all databases and critical data.
- Store backups in a **separate account/region** from the primary infrastructure.
- Test backup restoration quarterly — a backup never tested is not a backup.
- Define and document **RTO** (Recovery Time Objective) and **RPO** (Recovery Point Objective).

### 5.5 Incident Response

- Write and maintain an **Incident Response (IR) playbook** covering:
  1. Detection and triage (how to confirm a real incident)
  2. Containment (how to isolate affected systems)
  3. Eradication (how to remove the threat)
  4. Recovery (how to restore service safely)
  5. Post-incident review (how to prevent recurrence)
- Define an on-call rotation and escalation path.
- Conduct a tabletop IR exercise at least once a year.
- Have a communication plan for notifying users and authorities if a breach occurs.

---

## Ongoing Practices

| Practice | Frequency |
|---|---|
| Security code review on all PRs | Every PR |
| Dependency vulnerability scan | Every CI build |
| Log review & alert triage | Daily |
| Rotate API keys and secrets | Every 90 days |
| Access control audit (remove stale accounts) | Monthly |
| Backup restoration test | Quarterly |
| Full vulnerability scan | Quarterly |
| Penetration test | Annually |
| Security training for developers (OWASP Top 10) | Annually |
| IR tabletop exercise | Annually |

---

## Attack Reference Checklist

Use this checklist to verify coverage against every major attack class:

### Injection Attacks
- [ ] SQL injection — parameterized queries enforced
- [ ] NoSQL injection — input validation on query operators
- [ ] Command injection — no shell exec with user input
- [ ] LDAP injection — input sanitization
- [ ] XPath injection — parameterized XPath queries
- [ ] Template injection (SSTI) — no user input in server-side templates

### Broken Authentication
- [ ] Brute force — rate limiting + lockout on login
- [ ] Credential stuffing — breached password check
- [ ] Session fixation — new session ID on login
- [ ] Weak session tokens — cryptographically random, sufficient entropy
- [ ] Insecure cookies — HttpOnly, Secure, SameSite flags set

### Sensitive Data Exposure
- [ ] Passwords hashed with Argon2id/bcrypt
- [ ] PII not logged
- [ ] Secrets not in source code
- [ ] TLS enforced everywhere
- [ ] HSTS enabled

### Broken Access Control
- [ ] IDOR — object-level authorization on every request
- [ ] Privilege escalation — server-side role checks
- [ ] Forced browsing — unauthenticated routes locked down
- [ ] CORS — allowlist of trusted origins only

### Security Misconfiguration
- [ ] Default credentials changed
- [ ] Unnecessary features/ports disabled
- [ ] Error messages do not expose stack traces
- [ ] Directory listing disabled
- [ ] Server version headers removed

### XSS
- [ ] Output HTML-encoded
- [ ] CSP enforced
- [ ] No unsafe-inline in CSP
- [ ] DOM-based XSS — safe DOM APIs used (textContent, not innerHTML)

### CSRF
- [ ] CSRF tokens on all state-changing forms
- [ ] SameSite cookie attribute set

### Vulnerable & Outdated Components
- [ ] All dependencies up to date
- [ ] CVE monitoring active
- [ ] Container images scanned

### Logging & Monitoring
- [ ] Auth events logged
- [ ] Alerts on anomalies configured
- [ ] Logs stored tamper-proof
- [ ] Incident response plan documented

### Business Logic
- [ ] Price/quantity tampering — server-side validation of all business values
- [ ] Race conditions — use database transactions and locks
- [ ] Mass assignment — allowlist accepted fields, reject unexpected keys

---

*End of security plan. Implement each section systematically, starting from Layer 1 and working inward.*
