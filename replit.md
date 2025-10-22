# Portfólio E-Commerce - Sistema de Publicações

## Visão Geral
Site portfólio elegante estilo Instagram com sistema completo de e-commerce integrado ao Supabase e WhatsApp. Permite mostrar projetos/sistemas desenvolvidos com possibilidade de compra através de publicações.

## Funcionalidades Principais

### Área Pública
- **Feed de Publicações**: Grid estilo Instagram com projetos/sistemas
- **Carrinho de Compras**: Sistema completo com adicionar/remover itens
- **Checkout**: Formulário com dados do cliente e método de pagamento
- **Envio WhatsApp**: Comanda automática enviada via WhatsApp
- **Projetos Personalizados**: Formulário para solicitar projetos customizados

### Área Administrativa (Protegida)
- **Autenticação Supabase**: Login seguro com email/senha
- **CRUD Publicações**: Criar, editar e excluir publicações
- **Configurações**: Gerenciar título do site, imagem hero e número WhatsApp
- **Gestão de Imagens**: URLs externas para imagens (sem upload)

## Stack Tecnológica

### Frontend
- React 18 com TypeScript
- Wouter (roteamento)
- TanStack Query (data fetching)
- Shadcn UI + Tailwind CSS (design system)
- Framer Motion (animações)
- Lucide React (ícones)

### Backend
- Supabase (PostgreSQL + Auth)
- Express.js (API)

### Banco de Dados (Supabase)
Tabelas:
- `publications`: Armazena publicações de projetos
- `settings`: Configurações do site (título, hero image, WhatsApp)

## Credenciais Admin
- Email: kernelpanic10190@gmail.com
- Senha: [Configurada no Supabase Auth]

## Estrutura de Dados

### Publication
- id (UUID)
- title (string)
- description (string, suporta links)
- imageUrl (string, URL externa)
- monthlyPrice (decimal)
- createdAt (timestamp)

### Setting
- id (UUID)
- key (string, unique)
- value (string)

Keys utilizadas:
- `site_title`: Título do portfólio
- `hero_image`: URL da imagem hero
- `whatsapp_number`: Número para receber mensagens

## Fluxo de Usuário

1. **Visitante**:
   - Acessa home → Visualiza publicações
   - Adiciona ao carrinho → Revisa itens
   - Vai para checkout → Preenche dados
   - Finaliza → Envia comanda via WhatsApp

2. **Cliente com Projeto Personalizado**:
   - Clica em "Projetos Personalizados"
   - Preenche formulário com descrição
   - Envia via WhatsApp

3. **Admin**:
   - Login em /admin/login
   - Gerencia publicações (criar/editar/deletar)
   - Configura site (título, hero, WhatsApp)

## Design
- **Tema**: Dark elegante (modo escuro permanente)
- **Estilo**: Instagram-inspired
- **Responsivo**: Mobile-first
- **Animações**: Transições suaves, hover effects
- **Cores**: Azul primário (#3B82F6), Verde WhatsApp (#25D366)

## Variáveis de Ambiente
- `VITE_SUPABASE_URL`: URL do projeto Supabase
- `VITE_SUPABASE_ANON_KEY`: Chave anônima do Supabase

## Integração WhatsApp
Formato da mensagem de pedido:
```
*Nova Comanda - Pedido*

*Cliente:* [nome]
*Cidade:* [cidade]
*Pagamento:* [método]

*Itens do Pedido:*

1. [Título]
   Quantidade: [qty]x
   Valor: R$ [preço]/mês

*Total: R$ [total]*

*Observações:*
[observações do cliente]
```

## Deployment
- Frontend + Backend: Render
- Banco de Dados: Supabase
- Imagens: URLs externas (não armazenadas localmente)

## Publicação Modelo
Título: "Sistema Menu Interativo - Restaurantes"
Descrição: "Cardápio digital completo com gestão de pedidos, integração WhatsApp e painel administrativo. Desenvolvido com React e Supabase. [Ver demo](https://menu-interativo.onrender.com/)"
Preço: R$ 150/mês

## Notas de Desenvolvimento
- Carrinho persiste no localStorage
- Autenticação gerenciada pelo Supabase Auth
- Imagens via URL (não há upload de arquivos)
- Dark mode forçado (sem toggle)
- WhatsApp abre em nova aba
- Validação com Zod em todos os formulários
