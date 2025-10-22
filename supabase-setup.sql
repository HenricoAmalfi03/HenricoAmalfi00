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
