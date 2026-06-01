
    const translations = {
      pt: {
        'nav.about': 'Sobre', 'nav.exp': 'Experiência', 'nav.edu': 'Formação', 'nav.proj': 'Projetos', 'nav.contact': 'Contato',
        'form.tag': '// contato', 'form.title1': 'Vamos trabalhar', 'form.title2': 'juntos?',
        'form.desc': 'Estou disponível para novos projetos, freelas e oportunidades. Preencha o formulário ou fale diretamente pelos canais abaixo.',
        'footer.badge': 'Disponível para novos projetos',
        'form.name': 'Nome', 'form.email': 'E-mail', 'form.phone': 'Telefone / WhatsApp', 'form.projtype': 'Tipo de projeto', 'form.message': 'Mensagem',
        'form.budget': 'Orçamento estimado', 'form.budget.1': 'Até R$ 1.000', 'form.budget.2': 'R$ 1.000 – R$ 5.000', 'form.budget.3': 'R$ 5.000 – R$ 15.000', 'form.budget.4': 'Acima de R$ 15.000', 'form.budget.5': 'A definir',
        'form.timeline': 'Prazo desejado', 'form.timeline.1': 'Urgente (menos de 2 semanas)', 'form.timeline.2': 'Cerca de 1 mês', 'form.timeline.3': '2 a 3 meses', 'form.timeline.4': 'Sem prazo definido',
        'form.source': 'Como me encontrou?',
        'form.select': 'Selecione...',
        'form.ph.name': 'Seu nome completo',
        'form.ph.email': 'seu@email.com',
        'form.ph.phone': '+55 11 00000-0000',
        'form.ph.message': 'Descreva seu projeto, prazo e qualquer detalhe relevante...', 'form.source.ref': 'Indicação', 'form.source.other': 'Outro',
        'form.send': 'Enviar mensagem', 'form.success_title': 'Mensagem enviada!', 'form.success_desc': 'Obrigado pelo contato, Alexandre. Retorno em até 24 horas.',
        'footer.copy': '© 2025 Alexandre Garcia. Todos os direitos reservados.',
      },
      en: {
        'nav.about': 'About', 'nav.exp': 'Experience', 'nav.edu': 'Education', 'nav.proj': 'Projects', 'nav.contact': 'Contact',
        'form.tag': '// contact', 'form.title1': 'Let\'s work', 'form.title2': 'together?',
        'form.desc': 'I\'m available for new projects, freelance work and opportunities. Fill out the form or reach out directly through the channels below.',
        'footer.badge': 'Available for new projects',
        'form.name': 'Name', 'form.email': 'E-mail', 'form.phone': 'Phone / WhatsApp', 'form.projtype': 'Project type', 'form.message': 'Message',
        'form.budget': 'Estimated budget', 'form.budget.1': 'Up to R$ 1,000', 'form.budget.2': 'R$ 1,000 – R$ 5,000', 'form.budget.3': 'R$ 5,000 – R$ 15,000', 'form.budget.4': 'Above R$ 15,000', 'form.budget.5': 'To be defined',
        'form.timeline': 'Desired timeline', 'form.timeline.1': 'Urgent (less than 2 weeks)', 'form.timeline.2': 'About 1 month', 'form.timeline.3': '2 to 3 months', 'form.timeline.4': 'No set deadline',
        'form.source': 'How did you find me?',
        'form.select': 'Select...',
        'form.ph.name': 'Your full name',
        'form.ph.email': 'your@email.com',
        'form.ph.phone': '+1 000 000-0000',
        'form.ph.message': 'Describe your project, timeline and any relevant details...', 'form.source.ref': 'Referral', 'form.source.other': 'Other',
        'form.send': 'Send message', 'form.success_title': 'Message sent!', 'form.success_desc': 'Thanks for reaching out, Alexandre will get back to you within 24 hours.',
        'footer.copy': '© 2025 Alexandre Garcia. All rights reserved.',
      },
      es: {
        'nav.about': 'Sobre mí', 'nav.exp': 'Experiencia', 'nav.edu': 'Formación', 'nav.proj': 'Proyectos', 'nav.contact': 'Contacto',
        'form.tag': '// contacto', 'form.title1': 'Trabajemos', 'form.title2': 'juntos?',
        'form.desc': 'Estoy disponible para nuevos proyectos, freelance y oportunidades. Completa el formulario o contáctame directamente por los canales abajo.',
        'footer.badge': 'Disponible para nuevos proyectos',
        'form.name': 'Nombre', 'form.email': 'Correo', 'form.phone': 'Teléfono / WhatsApp', 'form.projtype': 'Tipo de proyecto', 'form.message': 'Mensaje',
        'form.budget': 'Presupuesto estimado', 'form.budget.1': 'Hasta R$ 1.000', 'form.budget.2': 'R$ 1.000 – R$ 5.000', 'form.budget.3': 'R$ 5.000 – R$ 15.000', 'form.budget.4': 'Más de R$ 15.000', 'form.budget.5': 'Por definir',
        'form.timeline': 'Plazo deseado', 'form.timeline.1': 'Urgente (menos de 2 semanas)', 'form.timeline.2': 'Alrededor de 1 mes', 'form.timeline.3': '2 a 3 meses', 'form.timeline.4': 'Sin plazo definido',
        'form.source': '¿Cómo me encontraste?',
        'form.select': 'Seleccionar...',
        'form.ph.name': 'Tu nombre completo',
        'form.ph.email': 'tu@email.com',
        'form.ph.phone': '+55 11 00000-0000',
        'form.ph.message': 'Describe tu proyecto, plazos y cualquier detalle relevante...', 'form.source.ref': 'Recomendación', 'form.source.other': 'Otro',
        'form.send': 'Enviar mensaje', 'form.success_title': '¡Mensaje enviado!', 'form.success_desc': 'Gracias por contactarme. Te responderé en menos de 24 horas.',
        'footer.copy': '© 2025 Alexandre Garcia. Todos los derechos reservados.',
      }
    };

    const langLabels = { pt: 'PT', en: 'EN', es: 'ES' };

    function applyLang(lang) {
      const t = translations[lang];
      document.querySelectorAll('[data-i18n]').forEach(el => {
        if (t[el.dataset.i18n] !== undefined) el.textContent = t[el.dataset.i18n];
      });
      document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        if (t[el.dataset.i18nPh] !== undefined) el.placeholder = t[el.dataset.i18nPh];
      });
      document.getElementById('langToggleBtn').textContent = langLabels[lang];
      document.querySelectorAll('.lang-option').forEach(o => o.classList.toggle('active', o.dataset.lang === lang));
      document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;
      try { sessionStorage.setItem('ag-lang', lang); } catch (e) { }
    }

    (function () {
      const panel = document.getElementById('langPanel');
      const btn = document.getElementById('langToggleBtn');
      try { const s = sessionStorage.getItem('ag-lang'); if (s && translations[s]) applyLang(s); } catch (e) { }
      btn.addEventListener('click', e => { e.stopPropagation(); panel.classList.toggle('open'); });
      document.querySelectorAll('.lang-option').forEach(opt => {
        opt.addEventListener('click', () => { applyLang(opt.dataset.lang); setTimeout(() => panel.classList.remove('open'), 150); });
      });
      document.addEventListener('click', () => panel.classList.remove('open'));
    })();

