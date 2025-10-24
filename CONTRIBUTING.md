# Guia de Contribuição

## Como Contribuir

1. **Fork o projeto**
2. **Crie uma branch** para sua feature (`git checkout -b feature/nova-feature`)
3. **Commit suas mudanças** (`git commit -m 'Adiciona nova feature'`)
4. **Push para a branch** (`git push origin feature/nova-feature`)
5. **Abra um Pull Request**

## Padrões de Código

### JavaScript

- Use ES6+ features
- Nomes de variáveis em camelCase
- Nomes de constantes em UPPER_CASE
- Sempre use `const` ou `let`, nunca `var`
- Adicione comentários para lógica complexa

### CSS

- Use variáveis CSS quando possível
- Mobile-first approach
- BEM naming convention (opcional)
- Organize por componentes

### Commits

Formato: `tipo(escopo): descrição`

Tipos:
- `feat`: Nova feature
- `fix`: Bug fix
- `docs`: Documentação
- `style`: Formatação, CSS
- `refactor`: Refatoração de código
- `test`: Testes
- `chore`: Tarefas de manutenção

Exemplos:
```
feat(credits): adiciona sistema de cashback
fix(auth): corrige validação de email
docs(readme): atualiza instruções de setup
style(forms): melhora responsividade
```

## Estrutura de Arquivos

Ao adicionar novos arquivos:

### Frontend
- HTML: `/public/`
- CSS: `/public/css/`
- JavaScript: `/public/js/`
- Assets: `/public/assets/`

### Backend
- Routes: `/worker/routes/`
- Utils: `/worker/utils/`

## Testes

Antes de submeter PR:

1. Teste localmente: `npm run dev`
2. Verifique console do navegador
3. Teste em dispositivos móveis
4. Valide formulários
5. Teste fluxo de pagamento (sandbox)

## Documentação

- Atualize README.md se necessário
- Documente funções complexas
- Adicione comentários JSDoc quando aplicável

## Code Review

Todos os PRs passarão por code review. Prepare-se para:

- Explicar suas mudanças
- Fazer ajustes solicitados
- Seguir os padrões do projeto

## Dúvidas

Abra uma issue para discutir mudanças grandes antes de implementar.
