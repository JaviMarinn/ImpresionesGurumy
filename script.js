const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');
const loader = document.querySelector('.page-loader');
const backToTopButton = document.querySelector('.back-to-top');
const faqItems = document.querySelectorAll('.faq-item');
const orderForm = document.getElementById('order-form');
const fileInput = document.getElementById('file-input');
const selectedFileLabel = document.getElementById('selected-file');
const formStatus = document.getElementById('form-status');
const uploadArea = document.getElementById('upload-area');
const revealElements = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('[data-count]');
const galleryItems = document.querySelectorAll('.gallery-item');
const testimonials = document.querySelectorAll('.testimonial-card');
const prevButton = document.querySelector('.slider-prev');
const nextButton = document.querySelector('.slider-next');
let activeTestimonial = 0;

const allowedExtensions = ['pdf', 'docx', 'pptx', 'xlsx', 'jpg', 'jpeg', 'png'];

if (loader) {
  window.addEventListener('load', () => {
    loader.classList.add('is-hidden');
  });
}

if (menuToggle && nav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });
}

window.addEventListener('scroll', () => {
  if (backToTopButton) {
    backToTopButton.classList.toggle('visible', window.scrollY > 420);
  }
});

if (backToTopButton) {
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

if (faqItems.length) {
  faqItems.forEach((item) => {
    const button = item.querySelector('.faq-toggle');
    button?.addEventListener('click', () => {
      const isOpen = item.classList.toggle('is-open');
      button.setAttribute('aria-expanded', String(isOpen));
      button.querySelector('span').textContent = isOpen ? '−' : '+';
    });
  });
}

if (orderForm && fileInput && selectedFileLabel && formStatus) {
  const validateFile = (file) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    return extension && allowedExtensions.includes(extension);
  };

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) {
      selectedFileLabel.textContent = 'Ningún archivo seleccionado.';
      return;
    }

    const isValid = validateFile(file);
    selectedFileLabel.textContent = isValid
      ? `Archivo seleccionado: ${file.name}`
      : 'Formato no admitido. Usa PDF, DOCX, PPTX, XLSX, JPG o PNG.';
  });

  ['dragenter', 'dragover'].forEach((eventName) => {
    uploadArea?.addEventListener(eventName, (event) => {
      event.preventDefault();
      uploadArea.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach((eventName) => {
    uploadArea?.addEventListener(eventName, (event) => {
      event.preventDefault();
      uploadArea.classList.remove('dragover');
    });
  });

  uploadArea?.addEventListener('drop', (event) => {
    const file = event.dataTransfer?.files[0];
    if (file) {
      fileInput.files = event.dataTransfer.files;
      const isValid = validateFile(file);
      selectedFileLabel.textContent = isValid
        ? `Archivo seleccionado: ${file.name}`
        : 'Formato no admitido. Usa PDF, DOCX, PPTX, XLSX, JPG o PNG.';
    }
  });

  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const copies = document.getElementById('copies').value.trim();

    if (!name || !email || !phone || !copies) {
      formStatus.textContent = 'Por favor completa los campos obligatorios.';
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      formStatus.textContent = 'Introduce un correo válido.';
      return;
    }

    if (fileInput.files[0] && !validateFile(fileInput.files[0])) {
      formStatus.textContent = 'El archivo seleccionado no tiene un formato admitido.';
      return;
    }

    formStatus.textContent = 'Solicitud enviada correctamente. Nos pondremos en contacto pronto.';
    orderForm.reset();
    selectedFileLabel.textContent = 'Ningún archivo seleccionado.';
  });
}

const revealOnScroll = () => {
  revealElements.forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      element.classList.add('visible');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

const animateCounter = (counter) => {
  const target = Number(counter.dataset.count || 0);
  let current = 0;
  const step = Math.max(1, Math.floor(target / 20));
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      counter.textContent = target;
      clearInterval(timer);
      return;
    }
    counter.textContent = current;
  }, 40);
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });

counters.forEach((counter) => counterObserver.observe(counter));

if (galleryItems.length) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = '<div class="lightbox__content"><img alt="Vista ampliada" /><button class="lightbox__close" type="button">Cerrar</button></div>';
  document.body.appendChild(lightbox);

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const image = item.querySelector('img');
      const lightboxImage = lightbox.querySelector('img');
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightbox.classList.add('is-open');
    });
  });

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox || event.target.classList.contains('lightbox__close')) {
      lightbox.classList.remove('is-open');
    }
  });
}

if (testimonials.length && prevButton && nextButton) {
  const showTestimonial = (index) => {
    const safeIndex = (index + testimonials.length) % testimonials.length;
    testimonials.forEach((item, itemIndex) => {
      item.style.display = itemIndex === safeIndex ? 'block' : 'none';
    });
    activeTestimonial = safeIndex;
  };

  showTestimonial(0);
  prevButton.addEventListener('click', () => showTestimonial(activeTestimonial - 1));
  nextButton.addEventListener('click', () => showTestimonial(activeTestimonial + 1));
}
