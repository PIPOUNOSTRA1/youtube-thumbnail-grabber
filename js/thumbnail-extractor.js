/**
 * YouTube Thumbnail Grabber - Core JavaScript
 * Handles YouTube URL extraction, preview rendering, image downloads,
 * clipboard actions, and toast notifications.
 */

(function () {
  'use strict';

  // Available Thumbnail Resolutions
  const THUMBNAIL_CONFIGS = [
    {
      id: 'maxres',
      fileName: 'maxresdefault.jpg',
      label: 'Ultra HD (1080p / 720p)',
      resolution: '1280 × 720',
      badge: 'Maximum Quality',
      featured: true,
      description: 'Full High-Definition resolution. Best for desktop displays, printing, video production, and high-res presentations.'
    },
    {
      id: 'sd',
      fileName: 'sddefault.jpg',
      label: 'Standard Definition (480p)',
      resolution: '640 × 480',
      badge: 'Standard HD',
      featured: false,
      description: 'Standard DVD quality resolution. Ideal for blogs, responsive web design, and medium screen displays.'
    },
    {
      id: 'hq',
      fileName: 'hqdefault.jpg',
      label: 'High Quality (HQ 360p)',
      resolution: '480 × 360',
      badge: 'High Quality',
      featured: false,
      description: 'High-quality 4:3 cropped preview. Available on 100% of YouTube uploads, fast loading and lightweight.'
    },
    {
      id: 'mq',
      fileName: 'mqdefault.jpg',
      label: 'Medium Quality (MQ)',
      resolution: '320 × 180',
      badge: 'Medium Quality',
      featured: false,
      description: 'Compact 16:9 widescreen preview. Perfect for newsletters, mobile cards, and messaging apps.'
    },
    {
      id: 'default',
      fileName: 'default.jpg',
      label: 'Normal / Small Thumbnail',
      resolution: '120 × 90',
      badge: 'Small Size',
      featured: false,
      description: 'Smallest thumbnail dimension. Lightweight thumbnail used in YouTube search sidebar and mobile lists.'
    }
  ];

  // DOM Elements
  const form = document.getElementById('grabberForm');
  const urlInput = document.getElementById('youtubeUrl');
  const btnPaste = document.getElementById('btnPaste');
  const btnClear = document.getElementById('btnClear');
  const resultsSection = document.getElementById('resultsSection');
  const thumbnailsGrid = document.getElementById('thumbnailsGrid');
  const alertBox = document.getElementById('alertBox');
  const alertMsg = document.getElementById('alertMsg');
  const videoIdDisplay = document.getElementById('videoIdDisplay');
  const samplePills = document.querySelectorAll('.sample-pill');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');

  // Initialize
  function init() {
    setupEventListeners();
    setupFaqAccordions();
    checkUrlParams();
    setupCookieBanner();
  }

  // Setup Event Listeners
  function setupEventListeners() {
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        processUrl(urlInput.value.trim());
      });
    }

    if (btnPaste) {
      btnPaste.addEventListener('click', handlePaste);
    }

    if (btnClear) {
      btnClear.addEventListener('click', handleClear);
    }

    if (samplePills) {
      samplePills.forEach(pill => {
        pill.addEventListener('click', function () {
          const sampleUrl = this.getAttribute('data-url');
          if (sampleUrl && urlInput) {
            urlInput.value = sampleUrl;
            processUrl(sampleUrl);
          }
        });
      });
    }

    if (mobileMenuBtn && mainNav) {
      mobileMenuBtn.addEventListener('click', function () {
        mainNav.classList.toggle('open');
      });
    }

    // Auto-process on enter or paste in input
    if (urlInput) {
      urlInput.addEventListener('input', function () {
        hideAlert();
        if (this.value.length > 10) {
          const extractedId = extractVideoId(this.value.trim());
          if (extractedId) {
            processUrl(this.value.trim());
          }
        }
      });
    }
  }

  // Extract Video ID from various YouTube URL formats
  function extractVideoId(url) {
    if (!url) return null;
    url = url.trim();

    // Direct 11-char ID check (e.g. dQw4w9WgXcQ)
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return url;
    }

    // Standard patterns
    const patterns = [
      /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/i,
      /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/i,
      /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/i,
      /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/i,
      /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i,
      /(?:https?:\/\/)?(?:www\.|m\.)?youtube\.com\/live\/([a-zA-Z0-9_-]{11})/i,
      /(?:https?:\/\/)?(?:www\.|m\.)?youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]{11})/i
    ];

    for (let pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  // Process the URL
  function processUrl(input) {
    if (!input) {
      showAlert('Please enter or paste a valid YouTube video URL.');
      return;
    }

    const videoId = extractVideoId(input);

    if (!videoId) {
      showAlert('Invalid YouTube URL! Please check the link format. Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      return;
    }

    hideAlert();
    renderThumbnails(videoId);

    // Scroll smoothly to results
    if (resultsSection) {
      resultsSection.classList.add('active');
      if (videoIdDisplay) {
        videoIdDisplay.textContent = `Video ID: ${videoId}`;
      }
      setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }

  // Render Thumbnail Cards
  function renderThumbnails(videoId) {
    if (!thumbnailsGrid) return;
    thumbnailsGrid.innerHTML = '';

    THUMBNAIL_CONFIGS.forEach((config) => {
      const imgUrl = `https://img.youtube.com/vi/${videoId}/${config.fileName}`;
      const card = document.createElement('div');
      card.className = `thumb-card ${config.featured ? 'featured' : ''}`;

      card.innerHTML = `
        ${config.featured ? `<div class="featured-ribbon">${config.badge}</div>` : ''}
        <div class="thumb-image-container">
          <div class="thumb-skeleton" id="skel-${config.id}"></div>
          <img 
            src="${imgUrl}" 
            alt="YouTube Thumbnail ${config.label}" 
            class="thumb-img" 
            id="img-${config.id}"
            loading="lazy"
          />
        </div>
        <div class="thumb-content">
          <div class="thumb-header">
            <span class="quality-badge">${config.label}</span>
            <span class="dimensions-badge" id="res-${config.id}">${config.resolution}</span>
          </div>
          <p class="thumb-desc">${config.description}</p>
          <div class="thumb-actions">
            <button class="btn-download" data-url="${imgUrl}" data-id="${videoId}" data-res="${config.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download Image
            </button>
            <button class="btn-icon-action btn-copy" data-url="${imgUrl}" title="Copy Image Link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
            <a href="${imgUrl}" target="_blank" rel="noopener noreferrer" class="btn-icon-action" title="View Fullscreen">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>
      `;

      thumbnailsGrid.appendChild(card);

      // Verify image loading & check if maxres exists
      const imgElem = card.querySelector(`#img-${config.id}`);
      const skelElem = card.querySelector(`#skel-${config.id}`);

      imgElem.onload = function () {
        if (skelElem) skelElem.style.display = 'none';

        // Check if maxresdefault returned YouTube's 120x90 empty placeholder
        if (config.id === 'maxres' && this.naturalWidth <= 120) {
          const resBadge = card.querySelector(`#res-${config.id}`);
          if (resBadge) {
            resBadge.textContent = 'Not Available (Uploader uploaded lower res)';
            resBadge.style.color = '#B91C1C';
          }
          const desc = card.querySelector('.thumb-desc');
          if (desc) {
            desc.innerHTML = '<em>Note: The creator did not upload a 1080p custom thumbnail. Please use the Standard or High Quality options below.</em>';
          }
        }
      };

      imgElem.onerror = function () {
        if (skelElem) skelElem.style.display = 'none';
        this.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      };
    });

    // Attach Download & Copy Listeners
    setupResultActionButtons();
  }

  // Setup Download & Copy Action Buttons
  function setupResultActionButtons() {
    const downloadBtns = document.querySelectorAll('.btn-download');
    downloadBtns.forEach((btn) => {
      btn.addEventListener('click', function () {
        const url = this.getAttribute('data-url');
        const videoId = this.getAttribute('data-id');
        const res = this.getAttribute('data-res');
        const filename = `youtube-thumbnail-${videoId}-${res}.jpg`;
        downloadThumbnail(url, filename, this);
      });
    });

    const copyBtns = document.querySelectorAll('.btn-copy');
    copyBtns.forEach((btn) => {
      btn.addEventListener('click', function () {
        const url = this.getAttribute('data-url');
        copyToClipboard(url, 'Thumbnail URL copied to clipboard!');
      });
    });
  }

  // Download Thumbnail Function (Robust: Fetch Blob -> Canvas Fallback -> Tab Fallback)
  async function downloadThumbnail(url, filename, button) {
    const originalText = button.innerHTML;
    button.innerHTML = `
      <svg class="spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;animation:spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor"></path>
      </svg>
      Saving...
    `;
    button.disabled = true;

    try {
      // Method 1: Fetch as Blob (Direct download)
      const response = await fetch(url, { mode: 'cors' });
      if (!response.ok) throw new Error('Network error');
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      triggerDownloadLink(blobUrl, filename);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
      showToast('Thumbnail downloaded successfully!', 'success');
    } catch (err) {
      // Method 2: Canvas conversion
      try {
        await downloadViaCanvas(url, filename);
        showToast('Thumbnail downloaded successfully!', 'success');
      } catch (canvasErr) {
        // Method 3: Fallback open in new tab
        window.open(url, '_blank');
        showToast('Opened image in a new tab. Right-click and choose "Save image as..."', 'info');
      }
    } finally {
      button.innerHTML = originalText;
      button.disabled = false;
    }
  }

  // Canvas Fallback for Cross-Origin Image Download
  function downloadViaCanvas(url, filename) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = url;

      img.onload = function () {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          canvas.toBlob((blob) => {
            if (!blob) {
              reject(new Error('Canvas to blob failed'));
              return;
            }
            const blobUrl = URL.createObjectURL(blob);
            triggerDownloadLink(blobUrl, filename);
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
            resolve();
          }, 'image/jpeg', 0.95);
        } catch (e) {
          reject(e);
        }
      };

      img.onerror = (e) => reject(e);
    });
  }

  // Trigger browser download via virtual <a> anchor
  function triggerDownloadLink(url, filename) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Handle Paste Button
  async function handlePaste() {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          urlInput.value = text.trim();
          processUrl(text.trim());
          showToast('URL pasted from clipboard!', 'success');
        } else {
          showToast('Clipboard is empty!', 'error');
        }
      } else {
        urlInput.focus();
        showToast('Press Ctrl+V to paste manually', 'info');
      }
    } catch (err) {
      urlInput.focus();
      showToast('Clipboard access denied. Please press Ctrl+V to paste.', 'error');
    }
  }

  // Handle Clear Button
  function handleClear() {
    if (urlInput) {
      urlInput.value = '';
      urlInput.focus();
    }
    hideAlert();
    if (resultsSection) {
      resultsSection.classList.remove('active');
    }
  }

  // Copy to clipboard helper
  function copyToClipboard(text, successMessage) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMessage, 'success');
      }).catch(() => {
        legacyCopy(text, successMessage);
      });
    } else {
      legacyCopy(text, successMessage);
    }
  }

  function legacyCopy(text, successMessage) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showToast(successMessage, 'success');
    } catch (err) {
      showToast('Failed to copy', 'error');
    }
    document.body.removeChild(textarea);
  }

  // Toast Notification
  function showToast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let iconSvg = '';
    if (type === 'success') {
      iconSvg = '<svg style="width:18px;height:18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg style="width:18px;height:18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';
    } else {
      iconSvg = '<svg style="width:18px;height:18px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Alerts
  function showAlert(msg) {
    if (alertBox && alertMsg) {
      alertMsg.textContent = msg;
      alertBox.classList.add('active');
    }
  }

  function hideAlert() {
    if (alertBox) {
      alertBox.classList.remove('active');
    }
  }

  // FAQ Accordions
  function setupFaqAccordions() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');
      if (question && answer) {
        question.addEventListener('click', () => {
          const isActive = item.classList.contains('active');

          // Close all other accordions for clean UX
          faqItems.forEach(otherItem => {
            otherItem.classList.remove('active');
            const otherAns = otherItem.querySelector('.faq-answer');
            if (otherAns) otherAns.style.maxHeight = null;
          });

          if (!isActive) {
            item.classList.add('active');
            answer.style.maxHeight = answer.scrollHeight + 'px';
          }
        });
      }
    });
  }

  // Check URL parameters for direct video query (e.g. ?v=dQw4w9WgXcQ)
  function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const videoParam = params.get('v') || params.get('url') || params.get('id');
    if (videoParam && urlInput) {
      urlInput.value = videoParam;
      processUrl(videoParam);
    }
  }

  // Cookie Consent Banner (Google EU User Consent & GDPR)
  function setupCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    if (!banner) return;

    const consent = localStorage.getItem('yt_grabber_cookie_consent');
    if (!consent) {
      setTimeout(() => {
        banner.classList.add('active');
      }, 800);
    }

    const btnAccept = document.getElementById('btnCookieAccept');
    const btnDecline = document.getElementById('btnCookieDecline');

    if (btnAccept) {
      btnAccept.addEventListener('click', () => {
        localStorage.setItem('yt_grabber_cookie_consent', 'accepted');
        banner.classList.remove('active');
      });
    }

    if (btnDecline) {
      btnDecline.addEventListener('click', () => {
        localStorage.setItem('yt_grabber_cookie_consent', 'declined');
        banner.classList.remove('active');
      });
    }
  }

  // Run on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

