/**
 * ADVANCED VALIDATORS
 * Real-time validation with detailed feedback
 */

const Validators = {
    // Email validation
    email(value) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return {
            valid: regex.test(value),
            message: 'Email inválido. Use o formato: exemplo@email.com'
        };
    },

    // CPF validation (with detailed feedback)
    cpf(value) {
        const cpf = value.replace(/\D/g, '');

        if (cpf.length !== 11) {
            return {
                valid: false,
                message: 'CPF deve ter 11 dígitos'
            };
        }

        if (/^(\d)\1+$/.test(cpf)) {
            return {
                valid: false,
                message: 'CPF inválido. Todos os dígitos são iguais'
            };
        }

        // Validate check digits
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let digit = 11 - (sum % 11);
        if (digit >= 10) digit = 0;
        if (digit !== parseInt(cpf.charAt(9))) {
            return {
                valid: false,
                message: 'CPF inválido. Dígito verificador incorreto'
            };
        }

        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        digit = 11 - (sum % 11);
        if (digit >= 10) digit = 0;
        if (digit !== parseInt(cpf.charAt(10))) {
            return {
                valid: false,
                message: 'CPF inválido. Dígito verificador incorreto'
            };
        }

        return {
            valid: true,
            message: 'CPF válido ✓'
        };
    },

    // CNPJ validation
    cnpj(value) {
        const cnpj = value.replace(/\D/g, '');

        if (cnpj.length !== 14) {
            return {
                valid: false,
                message: 'CNPJ deve ter 14 dígitos'
            };
        }

        if (/^(\d)\1+$/.test(cnpj)) {
            return {
                valid: false,
                message: 'CNPJ inválido'
            };
        }

        let length = cnpj.length - 2;
        let numbers = cnpj.substring(0, length);
        let digits = cnpj.substring(length);
        let sum = 0;
        let pos = length - 7;

        for (let i = length; i >= 1; i--) {
            sum += numbers.charAt(length - i) * pos--;
            if (pos < 2) pos = 9;
        }

        let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
        if (result !== parseInt(digits.charAt(0))) {
            return {
                valid: false,
                message: 'CNPJ inválido'
            };
        }

        length = length + 1;
        numbers = cnpj.substring(0, length);
        sum = 0;
        pos = length - 7;

        for (let i = length; i >= 1; i--) {
            sum += numbers.charAt(length - i) * pos--;
            if (pos < 2) pos = 9;
        }

        result = sum % 11 < 2 ? 0 : 11 - sum % 11;
        if (result !== parseInt(digits.charAt(1))) {
            return {
                valid: false,
                message: 'CNPJ inválido'
            };
        }

        return {
            valid: true,
            message: 'CNPJ válido ✓'
        };
    },

    // Phone validation
    phone(value) {
        const phone = value.replace(/\D/g, '');

        if (phone.length < 10) {
            return {
                valid: false,
                message: 'Telefone deve ter no mínimo 10 dígitos'
            };
        }

        if (phone.length > 11) {
            return {
                valid: false,
                message: 'Telefone deve ter no máximo 11 dígitos'
            };
        }

        return {
            valid: true,
            message: 'Telefone válido ✓'
        };
    },

    // Password strength
    password(value) {
        if (value.length < 6) {
            return {
                valid: false,
                message: 'Senha deve ter no mínimo 6 caracteres',
                strength: 'weak'
            };
        }

        let strength = 0;

        // Length
        if (value.length >= 8) strength++;
        if (value.length >= 12) strength++;

        // Contains lowercase
        if (/[a-z]/.test(value)) strength++;

        // Contains uppercase
        if (/[A-Z]/.test(value)) strength++;

        // Contains numbers
        if (/\d/.test(value)) strength++;

        // Contains special chars
        if (/[^a-zA-Z0-9]/.test(value)) strength++;

        const strengthLevels = {
            0: { label: 'Muito fraca', color: '#ef4444', valid: false },
            1: { label: 'Fraca', color: '#f59e0b', valid: false },
            2: { label: 'Fraca', color: '#f59e0b', valid: false },
            3: { label: 'Média', color: '#eab308', valid: true },
            4: { label: 'Boa', color: '#84cc16', valid: true },
            5: { label: 'Forte', color: '#10b981', valid: true },
            6: { label: 'Muito forte', color: '#10b981', valid: true }
        };

        const level = strengthLevels[strength];

        return {
            valid: level.valid,
            message: `Força da senha: ${level.label}`,
            strength: level.label,
            color: level.color
        };
    },

    // Credit card number (Luhn algorithm)
    creditCard(value) {
        const number = value.replace(/\s/g, '');

        if (!/^\d+$/.test(number)) {
            return {
                valid: false,
                message: 'Número do cartão deve conter apenas dígitos'
            };
        }

        if (number.length < 13 || number.length > 19) {
            return {
                valid: false,
                message: 'Número do cartão inválido'
            };
        }

        // Luhn algorithm
        let sum = 0;
        let isEven = false;

        for (let i = number.length - 1; i >= 0; i--) {
            let digit = parseInt(number.charAt(i));

            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEven = !isEven;
        }

        const valid = sum % 10 === 0;

        // Detect card brand
        let brand = 'Desconhecido';
        if (/^4/.test(number)) brand = 'Visa';
        else if (/^5[1-5]/.test(number)) brand = 'Mastercard';
        else if (/^3[47]/.test(number)) brand = 'American Express';
        else if (/^6(?:011|5)/.test(number)) brand = 'Discover';

        return {
            valid,
            message: valid ? `Cartão ${brand} válido ✓` : 'Número do cartão inválido',
            brand
        };
    },

    // CVV validation
    cvv(value, cardNumber = '') {
        const cvv = value.replace(/\D/g, '');

        // American Express has 4 digits
        const isAmex = /^3[47]/.test(cardNumber.replace(/\s/g, ''));
        const expectedLength = isAmex ? 4 : 3;

        if (cvv.length !== expectedLength) {
            return {
                valid: false,
                message: `CVV deve ter ${expectedLength} dígitos`
            };
        }

        return {
            valid: true,
            message: 'CVV válido ✓'
        };
    },

    // URL validation
    url(value) {
        try {
            const url = new URL(value);
            return {
                valid: true,
                message: 'URL válida ✓',
                protocol: url.protocol,
                domain: url.hostname
            };
        } catch {
            return {
                valid: false,
                message: 'URL inválida. Use o formato: https://exemplo.com'
            };
        }
    },

    // Required field
    required(value) {
        const valid = value && value.trim().length > 0;
        return {
            valid,
            message: valid ? '' : 'Campo obrigatório'
        };
    },

    // Min length
    minLength(value, min) {
        const valid = value.length >= min;
        return {
            valid,
            message: valid ? '' : `Mínimo de ${min} caracteres`
        };
    },

    // Max length
    maxLength(value, max) {
        const valid = value.length <= max;
        return {
            valid,
            message: valid ? '' : `Máximo de ${max} caracteres`
        };
    },

    // Number range
    numberRange(value, min, max) {
        const num = parseFloat(value);
        const valid = !isNaN(num) && num >= min && num <= max;
        return {
            valid,
            message: valid ? '' : `Valor deve estar entre ${min} e ${max}`
        };
    },

    // Date validation
    date(value) {
        const date = new Date(value);
        const valid = !isNaN(date.getTime());
        return {
            valid,
            message: valid ? '' : 'Data inválida'
        };
    },

    // Future date
    futureDate(value) {
        const date = new Date(value);
        const now = new Date();
        const valid = date > now;
        return {
            valid,
            message: valid ? '' : 'Data deve ser futura'
        };
    },

    // Past date
    pastDate(value) {
        const date = new Date(value);
        const now = new Date();
        const valid = date < now;
        return {
            valid,
            message: valid ? '' : 'Data deve ser passada'
        };
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Validators;
}
