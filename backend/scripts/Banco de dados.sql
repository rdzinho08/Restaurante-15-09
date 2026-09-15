CREATE TYPE tipo_usuario_enum AS ENUM ('usuario', 'chef');

CREATE TABLE tb_usuario (
    id_usuario SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    nome_usuario VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    imagem_usuario TEXT,
    tipo tipo_usuario_enum NOT NULL DEFAULT 'usuario',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tb_receita (
    id_receita SERIAL PRIMARY KEY,
    titulo_receita VARCHAR(150) NOT NULL,
    origem_receita VARCHAR(100),
    url_imagem TEXT,
    id_usuario INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_usuario) REFERENCES tb_usuario (id_usuario) ON DELETE CASCADE
);

CREATE TABLE tb_favoritar (
    id_favorito SERIAL PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_receita INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (id_usuario) REFERENCES tb_usuario (id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_receita) REFERENCES tb_receita (id_receita) ON DELETE CASCADE,
    UNIQUE (id_usuario, id_receita)
);

INSERT INTO tb_usuario (id_usuario, nome, nome_usuario, email, senha, imagem_usuario, tipo, created_at, updated_at) VALUES
(1, 'Chef Marco Bianchi', 'chef1', 'chef1@saepchef.com', '123456', 'chef1.jpg', 'chef', '2026-01-10 09:15:00', '2026-01-10 09:15:00'),
(2, 'Chef Ana Ferreira', 'chef2', 'chef2@saepchef.com', '123456', 'chef2.jpg', 'chef', '2026-01-12 10:30:00', '2026-01-12 10:30:00'),
(3, 'Chef Lucas Tanaka', 'chef3', 'chef3@saepchef.com', '123456', 'chef3.jpg', 'chef', '2026-01-14 14:20:00', '2026-01-14 14:20:00'),
(4, 'Mariana Costa', 'usuario1', 'usuario1@gmail.com', '123456', 'usuario1.jpg', 'usuario', '2026-01-16 08:45:00', '2026-01-16 08:45:00'),
(5, 'Rafael Souza', 'usuario2', 'usuario2@gmail.com', '123456', 'usuario2.jpg', 'usuario', '2026-01-18 11:00:00', '2026-01-18 11:00:00'),
(6, 'Beatriz Lima', 'usuario3', 'usuario3@gmail.com', '123456', 'usuario3.jpg', 'usuario', '2026-01-20 16:10:00', '2026-01-20 16:10:00');

SELECT setval('tb_usuario_id_usuario_seq', (SELECT MAX(id_usuario) FROM tb_usuario));