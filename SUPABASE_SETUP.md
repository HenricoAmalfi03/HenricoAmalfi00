# ⚙️ Configuração do Supabase - IMPORTANTE

## ⚠️ Ação Necessária

Seu portfólio está **quase pronto**! Você precisa executar apenas **2 passos rápidos** no Supabase para ativar o sistema:

---

## 📋 Passo 1: Criar as Tabelas no Banco de Dados

1. **Acesse o SQL Editor do Supabase**:
   - Vá para: https://supabase.com/dashboard/project/hicnusqcvhdbuaumylpb/sql/new
   - Ou navegue: Seu Projeto → **SQL Editor** (menu lateral) → **New Query**

2. **Cole o SQL abaixo** e clique em **RUN** (ou Ctrl+Enter):

```sql
-- Criação das tabelas do portfólio

-- Tabela de publicações
CREATE TABLE IF NOT EXISTS publications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    monthly_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Tabela de configurações
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL
);

-- Inserir publicação exemplo - Menu Interativo
INSERT INTO publications (title, description, image_url, monthly_price)
VALUES (
    'Sistema Menu Interativo - Restaurantes',
    'Cardápio digital completo com gestão de pedidos, integração WhatsApp e painel administrativo. Desenvolvido com React e Supabase. Sistema responsivo e moderno para restaurantes aumentarem suas vendas. [Ver demo](https://menu-interativo.onrender.com/)',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    150.00
);

-- Inserir configurações padrão
INSERT INTO settings (key, value)
VALUES 
    ('site_title', 'Portfólio de Projetos'),
    ('hero_image', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80'),
    ('whatsapp_number', '5511999999999')
ON CONFLICT (key) DO NOTHING;

-- Habilitar Row Level Security (RLS)
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Políticas para publications (leitura pública, escrita apenas autenticados)
CREATE POLICY "Publicações são visíveis para todos" ON publications
    FOR SELECT USING (true);

CREATE POLICY "Apenas usuários autenticados podem inserir publicações" ON publications
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Apenas usuários autenticados podem atualizar publicações" ON publications
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Apenas usuários autenticados podem deletar publicações" ON publications
    FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para settings (leitura pública, escrita apenas autenticados)
CREATE POLICY "Configurações são visíveis para todos" ON settings
    FOR SELECT USING (true);

CREATE POLICY "Apenas usuários autenticados podem inserir configurações" ON settings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Apenas usuários autenticados podem atualizar configurações" ON settings
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Apenas usuários autenticados podem deletar configurações" ON settings
    FOR DELETE USING (auth.role() = 'authenticated');
```

✅ **Resultado esperado**: Você verá "Success. No rows returned" - isso é normal!

---

## 👤 Passo 2: Criar Seu Usuário Admin

1. **Vá para Authentication no Supabase**:
   - https://supabase.com/dashboard/project/hicnusqcvhdbuaumylpb/auth/users
   - Ou: Seu Projeto → **Authentication** → **Users**

2. **Clique em "Add user"** → **"Create new user"**

3. **Preencha os dados**:
   - **Email**: `kernelpanic10190@gmail.com` (ou seu email preferido)
   - **Password**: [Escolha uma senha forte - você vai precisar dela!]
   - ✅ **IMPORTANTE**: Marque a opção **"Auto Confirm User"**

4. **Clique em "Create user"**

---

## 🎉 Pronto! Agora você pode:

### 1. **Ver Publicações** (Página Inicial)
   - Acesse: http://localhost:5000 (ou URL do Replit)
   - Você verá a publicação exemplo do Menu Interativo
   - Pode adicionar ao carrinho e testar o checkout

### 2. **Acessar Área Admin** 
   - Vá para: http://localhost:5000/admin/login
   - Use o email e senha que você criou
   - Gerencie publicações, configure WhatsApp, etc.

### 3. **Testar Projetos Personalizados**
   - Clique no botão "Projetos Personalizados" no topo
   - Preencha e envie pelo WhatsApp

---

## 📱 Configurar Seu Número do WhatsApp

1. Entre na **Área Admin** → aba **"Configurações"**
2. No campo **"Número do WhatsApp"**, insira seu número no formato:
   - Exemplo: `5511999999999` (código do país + DDD + número)
   - Brasil: `55` + DDD (11, 21, etc) + número (9 dígitos)
3. Clique em **"Salvar Configurações"**

Agora todas as mensagens (pedidos e projetos personalizados) chegarão no seu WhatsApp!

---

## 🔒 Segurança Implementada

✅ **Endpoints protegidos**: Apenas usuários autenticados podem criar/editar/deletar publicações
✅ **RLS ativo**: Políticas de segurança do Supabase configuradas
✅ **Tokens JWT**: Autenticação via Supabase Auth
✅ **Leitura pública**: Visitantes podem ver publicações, mas não modificar

---

## ❓ Problemas?

### Erro "Could not find the table 'publications'"
→ Você ainda não executou o SQL do **Passo 1**. Volte e execute o script completo.

### Não consigo fazer login
→ Verifique se marcou **"Auto Confirm User"** ao criar o usuário no **Passo 2**.

### WhatsApp abre com número genérico
→ Configure seu número real na **Área Admin → Configurações**.

---

## 🎨 Personalize Seu Portfólio

Na **Área Admin**, você pode:
- ✏️ Editar **título do site** 
- 🖼️ Mudar **imagem hero** (cole URL de imagem)
- ➕ **Criar novas publicações** com seus projetos
- 📝 **Editar/Excluir** publicações existentes

**Dica**: Use URLs de imagens do Unsplash, Imgur ou seus próprios projetos hospedados!

---

## 📊 Estrutura do Banco

### Tabela `publications`
- Armazena todos os seus projetos/sistemas
- Campos: título, descrição (com links), imagem URL, preço mensal

### Tabela `settings`
- Configurações globais do site
- Keys: `site_title`, `hero_image`, `whatsapp_number`

---

🚀 **Após executar os 2 passos, seu portfólio estará 100% funcional!**
