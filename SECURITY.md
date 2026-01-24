# Security Policy (Responsible Disclosure)

We welcome responsible vulnerability reports that help improve the security, resilience, and trustworthiness of our systems and open-source artifacts.

This policy describes how to report security issues and which types of testing are acceptable.

---

## 1. Scope

This policy applies to:
- repositories and artifacts published under the Rock the Prototype organization, including **dsl-core**
- systems or environments explicitly designated by us as in-scope for security verification

If a target is not clearly in scope, please **ask first** and obtain written confirmation.

---

## 2. Safe Harbor & Intent

We support security research conducted:
- **lawfully**
- **minimal-invasively**
- strictly for **verification** (not exploitation)
- with **no harm** and **no disruption**

This policy is **not** a blanket permission to access systems. It defines conditions under which we welcome reports and coordinate disclosure.

---

## 3. What We Welcome

We welcome reports that:
- describe a vulnerability clearly and reproducibly
- avoid data access and avoid impact on availability/integrity
- include clear steps, prerequisites, and observed results
- propose mitigations where possible

Preferred evidence:
- precise affected component / endpoint / version
- minimal proof of concept (PoC) that avoids data access
- timestamps, logs, traces, or screenshots (where appropriate)

---

## 4. What Is NOT Allowed

The following activities are not permitted:
- denial-of-service (DoS), stress/load testing, or any action that degrades availability
- social engineering, phishing, or credential attacks (password guessing, spraying, etc.)
- access to accounts, data, or resources that you are not explicitly authorized to access
- privilege escalation attempts, persistence, backdoors, malware
- data exfiltration, copying databases, or handling personal data
- scanning/testing of systems that are not clearly in scope

If your validation would require any of the above, stop and contact us first.

---

## 5. How to Report

Please report security issues **confidentially** and include:
- affected system/component (URL, repo path, module, version)
- reproduction steps
- impact assessment (CIA: confidentiality / integrity / availability)
- any supporting artifacts (logs, timestamps, screenshots)

**Contact**
- Email: **sascha.block@rock-the-prototype.com**
- Subject: **[SECURITY] Vulnerability report – <short title>**

---

## 6. Coordinated Disclosure

We prefer **coordinated disclosure**:
- report confidentially first
- we acknowledge receipt and coordinate next steps
- public disclosure can follow after a fix is available or after a mutually agreed timeline

If you want public credit (name/handle), tell us. If you prefer anonymity, we respect that.

---

## 7. Response Targets (Best Effort)

We aim to:
- acknowledge receipt within **3 business days**
- provide an initial assessment within **10 business days**

Complex cases may require more time; we will communicate status updates.

---

## 8. Thank You

Responsible disclosure is a public good. Thank you for helping make systems safer.
