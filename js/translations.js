/**
 * Translation System for Pan Logistics
 * Supports English and French
 */

const translations = {
    en: {
        // Navigation
        "nav.home": "Home",
        "nav.services": "Services",
        "nav.about": "About",
        "nav.booking": "Booking",
        "nav.tracking": "Tracking",
        "nav.blog": "Blog",
        "nav.contact": "Contact",
        "nav.getQuote": "Get Quote",

        // Hero Section
        "hero.title": "Reliable Logistics & Freight Solutions in Canada",
        "hero.subtitle": "Your trusted partner for international shipping, freight forwarding, and warehousing services. Delivering excellence across borders since 2005.",
        "hero.requestQuote": "Request a Quote",
        "hero.trackShipment": "Track Shipment",

        // Services
        "services.title": "Our Core Services",
        "services.subtitle": "Comprehensive logistics solutions tailored to meet your business needs",
        "services.import": "Import Services",
        "services.import.desc": "Seamless import solutions from global suppliers. We handle customs clearance, documentation, and delivery to your door.",
        "services.export": "Export Solutions",
        "services.export.desc": "Expert export services for Canadian businesses. From documentation to freight forwarding, we ensure compliance and efficiency.",
        "services.freight": "Freight Forwarding",
        "services.freight.desc": "Multi-modal freight forwarding by air, sea, and land. Competitive rates with reliable schedules and real-time tracking.",
        "services.warehouse": "Warehousing & Storage",
        "services.warehouse.desc": "Secure warehousing solutions with inventory management. Temperature-controlled options available for sensitive cargo.",
        "services.learnMore": "Learn More",

        // Tracking
        "tracking.title": "Track Your Shipment",
        "tracking.subtitle": "Enter your tracking number to get real-time updates",
        "tracking.placeholder": "Enter tracking number",
        "tracking.trackBtn": "Track Shipment",
        "tracking.recent": "Recent Shipments",
        "tracking.status": "Status",
        "tracking.origin": "Origin",
        "tracking.destination": "Destination",
        "tracking.eta": "Estimated Delivery",
        "tracking.weight": "Weight",
        "tracking.type": "Type",
        "tracking.date": "Date",

        // Booking
        "booking.title": "Book Your Shipment",
        "booking.subtitle": "Fast, easy, and secure shipment booking",
        "booking.shipmentType": "Shipment Type",
        "booking.air": "Air Freight",
        "booking.sea": "Sea Freight",
        "booking.land": "Land Transport",
        "booking.pickup": "Pickup Address",
        "booking.destination": "Destination Address",
        "booking.weight": "Weight (kg)",
        "booking.dimensions": "Dimensions (L x W x H)",
        "booking.description": "Package Description",
        "booking.sender": "Sender Name",
        "booking.senderEmail": "Sender Email",
        "booking.senderPhone": "Sender Phone",
        "booking.recipient": "Recipient Name",
        "booking.recipientEmail": "Recipient Email",
        "booking.recipientPhone": "Recipient Phone",
        "booking.date": "Preferred Date",
        "booking.submit": "Submit Booking",
        "booking.reset": "Reset Form",

        // Contact
        "contact.title": "Contact Us",
        "contact.subtitle": "Get in touch with our team",
        "contact.address": "Address",
        "contact.phone": "Phone",
        "contact.email": "Email",
        "contact.hours": "Business Hours",
        "contact.name": "Your Name",
        "contact.messageEmail": "Email Address",
        "contact.subject": "Subject",
        "contact.message": "Message",
        "contact.send": "Send Message",
        "contact.success": "Message sent successfully!",

        // Blog
        "blog.title": "Pan Logistics Blog",
        "blog.subtitle": "Insights, updates, and news from the world of logistics",
        "blog.noPosts": "No Posts Yet",
        "blog.checkBack": "Check back soon for updates!",
        "blog.readMore": "Read More →",
        "blog.back": "← Back to Blog",
        "blog.notFound": "Post Not Found",
        "blog.notFoundText": "The post you're looking for doesn't exist.",

        // About
        "about.title": "About Us",
        "about.subtitle": "Learn more about Pan Logistics",
        "about.history": "Our History",
        "about.mission": "Our Mission",
        "about.vision": "Our Vision",
        "about.values": "Our Values",
        "about.team": "Meet Our Team",

        // Footer
        "footer.quickLinks": "Quick Links",
        "footer.services": "Services",
        "footer.about": "About Us",
        "footer.tracking": "Track Shipment",
        "footer.blog": "Blog",
        "footer.contact": "Contact",
        "footer.getQuote": "Get a Quote",
        "footer.copyright": "All rights reserved.",
        "footer.privacy": "Privacy Policy",
        "footer.terms": "Terms of Service",

        // Status
        "status.booked": "Booked",
        "status.pickup": "Pickup",
        "status.transit": "In Transit",
        "status.warehouse": "Warehouse",
        "status.delivery": "Out for Delivery",
        "status.delivered": "Delivered",

        // Common
        "common.loading": "Loading...",
        "common.error": "Error",
        "common.success": "Success",
        "common.cancel": "Cancel",
        "common.save": "Save",
        "common.delete": "Delete",
        "common.edit": "Edit",
        "common.view": "View Details"
    },
    fr: {
        // Navigation
        "nav.home": "Accueil",
        "nav.services": "Services",
        "nav.about": "À propos",
        "nav.booking": "Réservation",
        "nav.tracking": "Suivi",
        "nav.blog": "Blog",
        "nav.contact": "Contact",
        "nav.getQuote": "Devis",

        // Hero Section
        "hero.title": "Solutions Logistiques Fiables au Canada",
        "hero.subtitle": "Votre partenaire de confiance pour l'expédition internationale, le transport de marchandises et les services d'entreposage. L'excellence à travers les frontières depuis 2005.",
        "hero.requestQuote": "Demander un devis",
        "hero.trackShipment": "Suivre un envoi",

        // Services
        "services.title": "Nos Services Principaux",
        "services.subtitle": "Solutions logistiques complètes adaptées à vos besoins commerciaux",
        "services.import": "Services d'Importation",
        "services.import.desc": "Solutions d'importation transparentes de fournisseurs mondiaux. Nous gérons le dédouanement, la documentation et la livraison à votre porte.",
        "services.export": "Solutions d'Exportation",
        "services.export.desc": "Services d'exportation experts pour les entreprises canadiennes. De la documentation à l'affrètement, nous garantissons la conformité et l'efficacité.",
        "services.freight": "Affrètement",
        "services.freight.desc": "Affrètement multimodal par air, mer et terre. Tarifs compétitifs avec des horaires fiables et un suivi en temps réel.",
        "services.warehouse": "Entreposage et Stockage",
        "services.warehouse.desc": "Solutions d'entreposage sécurisées avec gestion des stocks. Options à température contrôlée disponibles pour les marchandises sensibles.",
        "services.learnMore": "En savoir plus",

        // Tracking
        "tracking.title": "Suivre Votre Envoi",
        "tracking.subtitle": "Entrez votre numéro de suivi pour obtenir des mises à jour en temps réel",
        "tracking.placeholder": "Entrez le numéro de suivi",
        "tracking.trackBtn": "Suivre l'envoi",
        "tracking.recent": "Envois Récents",
        "tracking.status": "Statut",
        "tracking.origin": "Origine",
        "tracking.destination": "Destination",
        "tracking.eta": "Livraison Estimée",
        "tracking.weight": "Poids",
        "tracking.type": "Type",
        "tracking.date": "Date",

        // Booking
        "booking.title": "Réserver Votre Envoi",
        "booking.subtitle": "Réservation d'envoi rapide, facile et sécurisée",
        "booking.shipmentType": "Type d'Envoi",
        "booking.air": "Fret Aérien",
        "booking.sea": "Fret Maritime",
        "booking.land": "Transport Terrestre",
        "booking.pickup": "Adresse de Retrait",
        "booking.destination": "Adresse de Destination",
        "booking.weight": "Poids (kg)",
        "booking.dimensions": "Dimensions (L x P x H)",
        "booking.description": "Description du Colis",
        "booking.sender": "Nom de l'Expéditeur",
        "booking.senderEmail": "Email de l'Expéditeur",
        "booking.senderPhone": "Téléphone de l'Expéditeur",
        "booking.recipient": "Nom du Destinataire",
        "booking.recipientEmail": "Email du Destinataire",
        "booking.recipientPhone": "Téléphone du Destinataire",
        "booking.date": "Date Prévue",
        "booking.submit": "Soumettre la Réservation",
        "booking.reset": "Réinitialiser",

        // Contact
        "contact.title": "Contactez-nous",
        "contact.subtitle": "Contactez notre équipe",
        "contact.address": "Adresse",
        "contact.phone": "Téléphone",
        "contact.email": "Email",
        "contact.hours": "Heures d'Ouverture",
        "contact.name": "Votre Nom",
        "contact.messageEmail": "Adresse Email",
        "contact.subject": "Sujet",
        "contact.message": "Message",
        "contact.send": "Envoyer le Message",
        "contact.success": "Message envoyé avec succès!",

        // Blog
        "blog.title": "Blog Pan Logistics",
        "blog.subtitle": "Perspectives, mises à jour et nouvelles du monde de la logistique",
        "blog.noPosts": "Aucun Article",
        "blog.checkBack": "Revenez bientôt pour les mises à jour!",
        "blog.readMore": "Lire la suite →",
        "blog.back": "← Retour au Blog",
        "blog.notFound": "Article Non Trouvé",
        "blog.notFoundText": "L'article que vous recherchez n'existe pas.",

        // About
        "about.title": "À Propos",
        "about.subtitle": "En savoir plus sur Pan Logistics",
        "about.history": "Notre Histoire",
        "about.mission": "Notre Mission",
        "about.vision": "Notre Vision",
        "about.values": "Nos Valeurs",
        "about.team": "Rencontrez Notre Équipe",

        // Footer
        "footer.quickLinks": "Liens Rapides",
        "footer.services": "Services",
        "footer.about": "À Propos",
        "footer.tracking": "Suivi de Colis",
        "footer.blog": "Blog",
        "footer.contact": "Contact",
        "footer.getQuote": "Obtenir un Devis",
        "footer.copyright": "Tous droits réservés.",
        "footer.privacy": "Politique de Confidentialité",
        "footer.terms": "Conditions d'Utilisation",

        // Status
        "status.booked": "Réservé",
        "status.pickup": "Enlèvement",
        "status.transit": "En Transit",
        "status.warehouse": "Entrepôt",
        "status.delivery": "En Livraison",
        "status.delivered": "Livré",

        // Common
        "common.loading": "Chargement...",
        "common.error": "Erreur",
        "common.success": "Succès",
        "common.cancel": "Annuler",
        "common.save": "Enregistrer",
        "common.delete": "Supprimer",
        "common.edit": "Modifier",
        "common.view": "Voir les Détails"
    }
};

/**
 * Translation function
 * @param {string} key - Translation key
 * @returns {string} - Translated text or original key if not found
 */
function t(key) {
    const lang = localStorage.getItem('preferredLanguage') || 'en';
    const translationsObj = translations[lang];
    return translationsObj[key] || key;
}

/**
 * Apply translations to all elements with data-i18n attribute
 */
function applyTranslations() {
    const lang = localStorage.getItem('preferredLanguage') || 'en';
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = translations[lang][key];
        if (translation) {
            el.textContent = translation;
        }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const translation = translations[lang][key];
        if (translation) {
            el.placeholder = translation;
        }
    });
    document.documentElement.lang = lang;
}

// Initialize translations on page load
document.addEventListener('DOMContentLoaded', applyTranslations);
