// Wunderbuild Email Signature Generator (v2)
// Revisions:
// 1) Fixed large sign-off gap (not editable). Default: 16px.
// 2) Stronger anti-underline inline styling: add border-bottom:0 + explicit text-decoration none on both <a> and inner <span>.

const SIGNOFF_GAP_PX = 16;

const DEFAULTS = {
  leftImageSrc: "https://storage.googleapis.com/wunderbuild-public/email-assets/wunderbuild.png",
  leftImageAlt: "Wunderbuild",

  iconEmailSrc: "https://storage.googleapis.com/wunderbuild-public/email-assets/email.png",
  iconMobileSrc: "https://storage.googleapis.com/wunderbuild-public/email-assets/mobile.png",
  iconPhoneSrc: "https://storage.googleapis.com/wunderbuild-public/email-assets/phone.png",
  iconWebsiteSrc: "https://storage.googleapis.com/wunderbuild-public/email-assets/website.png",
  iconAddressSrc: "https://storage.googleapis.com/wunderbuild-public/email-assets/address.png",

  iconFacebookSrc: "https://storage.googleapis.com/wunderbuild-public/email-assets/facebook.png",
  iconInstagramSrc: "https://storage.googleapis.com/wunderbuild-public/email-assets/instagram.png",
  iconLinkedinSrc: "https://storage.googleapis.com/wunderbuild-public/email-assets/linkedin.png",
  iconXSrc: "https://storage.googleapis.com/wunderbuild-public/email-assets/x.png",
  iconYoutubeSrc: "https://storage.googleapis.com/wunderbuild-public/email-assets/youtube.png",

  landlineText: "1300 161 626",
  landlineHref: "1300161626",

  websiteText: "www.wunderbuild.com",
  websiteHref: "https://www.wunderbuild.com",

  addressText: "L6, 607 Bourke St, Melbourne VIC 3000, AUS",
  addressHref: "https://maps.app.goo.gl/8zUPPZ8FU3o5C8LS9",

  facebookHref: "https://www.facebook.com/wunderbuild",
  instagramHref: "https://www.instagram.com/wunderbuild/",
  linkedinHref: "https://www.linkedin.com/company/wunderbuildglobal/",
  xHref: "https://x.com/wunder_build",
  youtubeHref: "https://www.youtube.com/@wunderbuild",

  cta1Text: "Book a demo",
  cta1Href: "https://www.wunderbuild.com/book-a-demo/",
  cta2Text: "Start your free trial",
  cta2Href: "https://app.wunderbuild.com/sign-up",

  colorInk: "#1d1c1b",
  colorBody: "#555555",
  ctaPrimaryBg: "#b4ff50",
};

const form = document.getElementById("sig-form");
const previewEl = document.getElementById("signaturePreview");

const copyBtn = document.getElementById("copyBtn");
const resetBtn = document.getElementById("resetBtn");
const copyStatus = document.getElementById("copyStatus");

const fullNameEl = document.getElementById("fullName");
const emailEl = document.getElementById("email");
const fullNameError = document.getElementById("fullNameError");
const emailError = document.getElementById("emailError");

const prefillMap = {
  landlineText: DEFAULTS.landlineText,
  landlineHref: DEFAULTS.landlineHref,
  websiteText: DEFAULTS.websiteText,
  websiteHref: DEFAULTS.websiteHref,
  addressText: DEFAULTS.addressText,
  addressHref: DEFAULTS.addressHref,
  facebookHref: DEFAULTS.facebookHref,
  instagramHref: DEFAULTS.instagramHref,
  linkedinHref: DEFAULTS.linkedinHref,
  xHref: DEFAULTS.xHref,
  youtubeHref: DEFAULTS.youtubeHref,
  cta1Text: DEFAULTS.cta1Text,
  cta1Href: DEFAULTS.cta1Href,
  cta2Text: DEFAULTS.cta2Text,
  cta2Href: DEFAULTS.cta2Href,
};

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeTel(str) {
  const raw = String(str || "").trim();
  if (!raw) return "";
  const plus = raw.startsWith("+") ? "+" : "";
  const digits = raw.replace(/[^\d]/g, "");
  return plus + digits;
}

function normalizeUrl(str) {
  const raw = String(str || "").trim();
  if (!raw) return "";
  const lower = raw.toLowerCase();
  if (lower.startsWith("http://") || lower.startsWith("https://") || lower.startsWith("mailto:") || lower.startsWith("tel:")) return raw;
  if (lower.startsWith("www.")) return "https://" + raw;
  return "https://" + raw;
}

function validateRequired() {
  const name = fullNameEl.value.trim();
  const email = emailEl.value.trim();

  let ok = true;

  if (!name) {
    fullNameError.textContent = "Full name is required.";
    ok = false;
  } else {
    fullNameError.textContent = "";
  }

  if (!email) {
    emailError.textContent = "Email address is required.";
    ok = false;
  } else if (!email.includes("@")) {
    emailError.textContent = "That email looks incomplete (missing “@”).";
    ok = false;
  } else {
    emailError.textContent = "";
  }

  copyBtn.disabled = !ok;
  return ok;
}

function getFormData() {
  const fd = new FormData(form);
  return {
    signoff: String(fd.get("signoff") || "").trim(),

    fullName: String(fd.get("fullName") || "").trim(),
    jobTitle: String(fd.get("jobTitle") || "").trim(),

    email: String(fd.get("email") || "").trim(),
    mobileText: String(fd.get("mobile") || "").trim(),

    landlineText: String(fd.get("landlineText") || "").trim(),
    landlineHref: String(fd.get("landlineHref") || "").trim(),

    websiteText: String(fd.get("websiteText") || "").trim(),
    websiteHref: String(fd.get("websiteHref") || "").trim(),

    addressText: String(fd.get("addressText") || "").trim(),
    addressHref: String(fd.get("addressHref") || "").trim(),

    cta1Text: String(fd.get("cta1Text") || "").trim(),
    cta1Href: String(fd.get("cta1Href") || "").trim(),

    cta2Text: String(fd.get("cta2Text") || "").trim(),
    cta2Href: String(fd.get("cta2Href") || "").trim(),

    facebookHref: String(fd.get("facebookHref") || "").trim(),
    instagramHref: String(fd.get("instagramHref") || "").trim(),
    linkedinHref: String(fd.get("linkedinHref") || "").trim(),
    xHref: String(fd.get("xHref") || "").trim(),
    youtubeHref: String(fd.get("youtubeHref") || "").trim(),
  };
}

function buildContactRow({ iconSrc, iconAlt, href, text }) {
  const linkStyle = `color: ${DEFAULTS.colorBody} !important; text-decoration: none !important; text-decoration: unset !important; border-bottom: 0 !important; font-size: 12px; line-height: 1.2;`;
  const spanStyle = `color: ${DEFAULTS.colorBody} !important; text-decoration: none !important; text-decoration: unset !important; border-bottom: 0 !important;`;
  return `
    <tr>
      <td style="padding: 0 6px 5px 0; vertical-align: middle;">
        <img src="${escapeHtml(iconSrc)}" alt="${escapeHtml(iconAlt)}" width="15" height="15" style="display: block; border: 0;" />
      </td>
      <td style="padding: 0 0 5px 0; vertical-align: middle;">
        <a href="${escapeHtml(href)}" style="${linkStyle}">
          <span style="${spanStyle}">${escapeHtml(text)}</span>
        </a>
      </td>
    </tr>
  `;
}

function buildSocialIcon({ href, iconSrc, alt, last=false }) {
  const mr = last ? "0" : "5px";
  return `
    <a href="${escapeHtml(href)}"
      style="text-decoration: none !important; text-decoration: unset !important; border: 0; border-bottom: 0 !important; display: inline-block; margin-right: ${mr};">
      <img src="${escapeHtml(iconSrc)}" alt="${escapeHtml(alt)}" width="18" height="18" style="display: block; border: 0;" />
    </a>
  `;
}

function spacer(h) {
  return `
    <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
      <tbody><tr><td height="${h}" style="line-height:${h}px; font-size:0;">&nbsp;</td></tr></tbody>
    </table>
  `;
}

function buildSignatureHtml(data) {
  const name = data.fullName.trim();
  const title = data.jobTitle.trim();

  const emailText = data.email.trim();
  const emailHref = emailText ? `mailto:${emailText}` : "";

  const mobileText = data.mobileText.trim();
  const mobileHref = mobileText ? `tel:${normalizeTel(mobileText)}` : "";

  const landlineText = data.landlineText.trim();
  const landlineHref = landlineText && data.landlineHref.trim()
    ? `tel:${normalizeTel(data.landlineHref)}`
    : (landlineText ? `tel:${normalizeTel(landlineText)}` : "");

  const websiteText = data.websiteText.trim();
  const websiteHref = websiteText && data.websiteHref.trim() ? normalizeUrl(data.websiteHref) : "";

  const addressText = data.addressText.trim();
  const addressHref = addressText && data.addressHref.trim() ? normalizeUrl(data.addressHref) : "";

  const contactRows = [];
  if (emailText && emailHref) contactRows.push(buildContactRow({ iconSrc: DEFAULTS.iconEmailSrc, iconAlt: "Email", href: emailHref, text: emailText }));
  if (mobileText && mobileHref) contactRows.push(buildContactRow({ iconSrc: DEFAULTS.iconMobileSrc, iconAlt: "Mobile", href: mobileHref, text: mobileText }));
  if (landlineText && landlineHref) contactRows.push(buildContactRow({ iconSrc: DEFAULTS.iconPhoneSrc, iconAlt: "Telephone", href: landlineHref, text: landlineText }));
  if (websiteText && websiteHref) contactRows.push(buildContactRow({ iconSrc: DEFAULTS.iconWebsiteSrc, iconAlt: "Website", href: websiteHref, text: websiteText }));
  if (addressText && addressHref) contactRows.push(buildContactRow({ iconSrc: DEFAULTS.iconAddressSrc, iconAlt: "Address", href: addressHref, text: addressText }));

  const contactBlock = contactRows.length ? `
    <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;">
      <tbody>${contactRows.join("")}</tbody>
    </table>
  ` : "";

  const socialIcons = [];
  if (data.facebookHref.trim()) socialIcons.push(buildSocialIcon({ href: normalizeUrl(data.facebookHref), iconSrc: DEFAULTS.iconFacebookSrc, alt: "Facebook" }));
  if (data.instagramHref.trim()) socialIcons.push(buildSocialIcon({ href: normalizeUrl(data.instagramHref), iconSrc: DEFAULTS.iconInstagramSrc, alt: "Instagram" }));
  if (data.linkedinHref.trim()) socialIcons.push(buildSocialIcon({ href: normalizeUrl(data.linkedinHref), iconSrc: DEFAULTS.iconLinkedinSrc, alt: "LinkedIn" }));
  if (data.xHref.trim()) socialIcons.push(buildSocialIcon({ href: normalizeUrl(data.xHref), iconSrc: DEFAULTS.iconXSrc, alt: "X" }));
  if (data.youtubeHref.trim()) socialIcons.push(buildSocialIcon({ href: normalizeUrl(data.youtubeHref), iconSrc: DEFAULTS.iconYoutubeSrc, alt: "YouTube", last:true }));

  const socialsBlock = socialIcons.length ? `
    <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse;">
      <tbody><tr><td style="padding:0;">${socialIcons.join("")}</td></tr></tbody>
    </table>
  ` : "";

  const ctas = [];

  function buildBulletproofButton({ text, href, bgColor, borderColor, textColor }) {
    // Table-based "bulletproof" button: more consistent across Gmail iOS / Outlook than padding on <a> alone.
    const tdStyle = [
      `background-color:${bgColor};`,
      `border:1px solid ${borderColor};`,
      `border-radius:100px;`,
      `mso-padding-alt:10px 20px;`,
    ].join(" ");
    const aStyle = [
      `display:block;`,
      `padding:10px 20px;`,
      `font-size:12px;`,
      `font-weight:600;`,
      `line-height:14px;`,
      `color:${textColor} !important;`,
      `text-decoration:none !important; text-decoration:unset !important;`,
      `border-bottom:0 !important;`,
      `white-space:nowrap;`,
    ].join(" ");

    return `
      <table cellpadding="0" cellspacing="0" border="0" style="display:inline-table; border-collapse:separate; mso-table-lspace:0pt; mso-table-rspace:0pt; vertical-align:top;">
        <tbody>
          <tr>
            <td bgcolor="${escapeHtml(bgColor)}" style="${tdStyle}">
              <a href="${escapeHtml(href)}" style="${aStyle}">
                <span style="color:${textColor} !important; text-decoration:none !important; text-decoration:unset !important; border-bottom:0 !important;">${escapeHtml(text)}</span>
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    `;
  }

  const cta1Text = data.cta1Text.trim();
  const cta1Href = data.cta1Href.trim() ? normalizeUrl(data.cta1Href) : "";
  if (cta1Text && cta1Href) {
    ctas.push(buildBulletproofButton({
      text: cta1Text,
      href: cta1Href,
      bgColor: DEFAULTS.ctaPrimaryBg,
      borderColor: DEFAULTS.ctaPrimaryBg,
      textColor: DEFAULTS.colorInk
    }));
  }

  const cta2Text = data.cta2Text.trim();
  const cta2Href = data.cta2Href.trim() ? normalizeUrl(data.cta2Href) : "";
  if (cta2Text && cta2Href) {
    ctas.push(buildBulletproofButton({
      text: cta2Text,
      href: cta2Href,
      bgColor: "#ffffff",
      borderColor: DEFAULTS.colorInk,
      textColor: DEFAULTS.colorInk
    }));
  }

  const ctasBlock = ctas.length ? `
    <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;">
      <tbody>
        <tr>
          <td style="padding:0;">
            ${ctas.join('<span style="display:inline-block; width:5px; line-height:0; font-size:0;">&nbsp;</span>')}
          </td>
        </tr>
      </tbody>
    </table>
  ` : "";

  const nameBlock = name ? `
    <table cellpadding="0" cellspacing="0" border="0" style="border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;">
      <tbody>
        <tr>
          <td style="font-size:16px; font-weight:bold; color:${DEFAULTS.colorInk}; padding:0 0 4px 0; line-height:1.2;">
            ${escapeHtml(name)}
          </td>
        </tr>
        ${title ? `
        <tr>
          <td style="font-size:12px; color:${DEFAULTS.colorBody}; padding:0; line-height:1.2;">
            ${escapeHtml(title)}
          </td>
        </tr>` : ""}
      </tbody>
    </table>
  ` : "";

  const signatureCore = `
    <table cellpadding="0" cellspacing="0" border="0"
      style="font-family: Arial, sans-serif; font-size:14px; line-height:1.4; color:#333333; border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;">
      <tbody>
        <tr>
          <td style="padding-right:15px; vertical-align:top;">
            <img src="${escapeHtml(DEFAULTS.leftImageSrc)}" alt="${escapeHtml(DEFAULTS.leftImageAlt)}"
              width="60" height="60" style="display:block; border:0; border-radius:100px;" />
          </td>
          <td style="vertical-align:top;">
            ${nameBlock}
            ${nameBlock ? spacer(15) : ""}
            ${contactBlock}
            ${contactBlock ? spacer(15) : ""}
            ${socialsBlock}
            ${socialsBlock ? spacer(15) : ""}
            ${ctasBlock}
            ${ctasBlock ? spacer(6) : ""}
          </td>
        </tr>
      </tbody>
    </table>
  `;

  const signoff = data.signoff.trim();

  return signoff ? `
    <table cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; font-family: Arial, sans-serif;">
      <tbody>
        <tr>
          <td style="font-size:14px; line-height:1.4; color:#333333;">
            ${escapeHtml(signoff)}
          </td>
        </tr>
        <tr>
          <td height="${SIGNOFF_GAP_PX}" style="line-height:${SIGNOFF_GAP_PX}px; font-size:0;">&nbsp;</td>
        </tr>
        <tr><td>${signatureCore}</td></tr>
      </tbody>
    </table>
  ` : signatureCore;
}

function render() {
  validateRequired();
  const data = getFormData();
  previewEl.innerHTML = buildSignatureHtml(data);
}

async function copyForGmail() {
  if (!validateRequired()) {
    copyStatus.textContent = "Please fill the required fields before copying.";
    return;
  }

  const html = previewEl.innerHTML;
  copyStatus.textContent = "";

  try {
    if (navigator.clipboard && window.ClipboardItem) {
      const blobHtml = new Blob([html], { type: "text/html" });
      const blobText = new Blob([previewEl.textContent || ""], { type: "text/plain" });
      const item = new ClipboardItem({ "text/html": blobHtml, "text/plain": blobText });
      await navigator.clipboard.write([item]);
      copyStatus.textContent = "✅ Copied for Gmail. Next: paste into Gmail → Settings → Signature.";
      return;
    }
  } catch (_) {}

  try {
    const temp = document.createElement("div");
    temp.setAttribute("contenteditable", "true");
    temp.style.position = "fixed";
    temp.style.left = "-9999px";
    temp.style.top = "0";
    temp.style.width = "1px";
    temp.style.height = "1px";
    temp.style.opacity = "0";
    temp.innerHTML = html;

    document.body.appendChild(temp);

    const range = document.createRange();
    range.selectNodeContents(temp);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);

    const ok = document.execCommand("copy");
    sel.removeAllRanges();
    document.body.removeChild(temp);

    copyStatus.textContent = ok
      ? "✅ Copied for Gmail. Next: paste into Gmail → Settings → Signature."
      : "Copy didn’t work automatically. Use Manual copy steps below.";
  } catch (_) {
    copyStatus.textContent = "Copy didn’t work automatically. Use Manual copy steps below.";
  }
}

function resetToDefaults() {
  fullNameEl.value = "";
  emailEl.value = "";
  document.getElementById("jobTitle").value = "";
  document.getElementById("mobile").value = "";

  document.getElementById("signoff").value = "Cheers,";

  for (const [id, val] of Object.entries(prefillMap)) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }

  copyStatus.textContent = "";
  render();
}

function applyInitialPrefills() {
  for (const [id, val] of Object.entries(prefillMap)) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }
}

form.addEventListener("input", render);
copyBtn.addEventListener("click", copyForGmail);
resetBtn.addEventListener("click", resetToDefaults);

applyInitialPrefills();
render();
