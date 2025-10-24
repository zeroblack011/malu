/**
 * SEO OPTIMIZATION
 * Dynamic meta tags and structured data
 */

const SEO = {
    // Update page meta tags
    updateMeta(data) {
        // Title
        if (data.title) {
            document.title = `${data.title} | Malu Digital Services`;
        }

        // Description
        if (data.description) {
            this.setMetaTag('description', data.description);
        }

        // Keywords
        if (data.keywords) {
            this.setMetaTag('keywords', data.keywords.join(', '));
        }

        // Open Graph
        if (data.title) {
            this.setMetaTag('og:title', data.title, 'property');
        }
        if (data.description) {
            this.setMetaTag('og:description', data.description, 'property');
        }
        if (data.image) {
            this.setMetaTag('og:image', data.image, 'property');
        }
        this.setMetaTag('og:url', window.location.href, 'property');
        this.setMetaTag('og:type', 'website', 'property');

        // Twitter Card
        this.setMetaTag('twitter:card', 'summary_large_image', 'name');
        if (data.title) {
            this.setMetaTag('twitter:title', data.title, 'name');
        }
        if (data.description) {
            this.setMetaTag('twitter:description', data.description, 'name');
        }
        if (data.image) {
            this.setMetaTag('twitter:image', data.image, 'name');
        }
    },

    // Set meta tag
    setMetaTag(name, content, attribute = 'name') {
        let tag = document.querySelector(`meta[${attribute}="${name}"]`);

        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute(attribute, name);
            document.head.appendChild(tag);
        }

        tag.setAttribute('content', content);
    },

    // Add structured data (JSON-LD)
    addStructuredData(data) {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(data);

        const existingScript = document.querySelector('script[type="application/ld+json"]');
        if (existingScript) {
            existingScript.replaceWith(script);
        } else {
            document.head.appendChild(script);
        }
    },

    // Organization structured data
    setOrganization() {
        this.addStructuredData({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Malu Digital Services",
            "description": "Plataforma premium de serviços digitais",
            "url": window.location.origin,
            "logo": `${window.location.origin}/assets/icon-512.png`,
            "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+55-11-99999-9999",
                "contactType": "customer service",
                "email": "suporte@malu.digital",
                "availableLanguage": ["pt-BR"]
            },
            "sameAs": [
                "https://facebook.com/maludigital",
                "https://instagram.com/maludigital",
                "https://twitter.com/maludigital"
            ]
        });
    },

    // Product structured data (for services)
    setProduct(service) {
        this.addStructuredData({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": service.name,
            "description": service.description,
            "offers": {
                "@type": "Offer",
                "price": service.credits,
                "priceCurrency": "CREDITS",
                "availability": "https://schema.org/InStock"
            }
        });
    },

    // Breadcrumb structured data
    setBreadcrumb(items) {
        this.addStructuredData({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": items.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "item": item.url
            }))
        });
    },

    // FAQ structured data
    setFAQ(faqs) {
        this.addStructuredData({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        });
    }
};

// Initialize SEO
SEO.setOrganization();
