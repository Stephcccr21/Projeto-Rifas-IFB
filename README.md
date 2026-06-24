# Sistema de Rifas Online

## 1. Visão Geral do Projeto

O Sistema de Rifas Online foi desenvolvido com o objetivo de facilitar a criação, gerenciamento e participação em rifas digitais. A plataforma permite que organizadores criem campanhas de arrecadação por meio de rifas, acompanhem vendas e pagamentos, realizem sorteios e divulguem resultados de forma transparente.

O projeto surgiu da necessidade de modernizar o processo tradicional de rifas, eliminando controles manuais e oferecendo uma experiência mais segura e organizada tanto para organizadores quanto para participantes.

---

## 2. Contextualização do Problema

Muitas rifas são organizadas utilizando planilhas, mensagens em aplicativos de conversa e controles manuais, o que pode gerar problemas como:

* Dificuldade no gerenciamento dos números vendidos;
* Falta de transparência nos sorteios;
* Controle inadequado de pagamentos;
* Dificuldade na divulgação dos resultados;
* Falta de centralização das informações dos participantes.

Diante desses desafios, foi desenvolvida uma solução web capaz de centralizar todas as etapas do processo de uma rifa.

---

## 3. Objetivos da Solução

### Objetivo Geral

Desenvolver uma plataforma web para gerenciamento completo de rifas online.

### Objetivos Específicos

* Permitir o cadastro e autenticação de usuários.
* Possibilitar a criação e edição de rifas.
* Gerenciar números disponíveis, reservados e pagos.
* Controlar transações e pagamentos.
* Permitir comentários dos participantes.
* Realizar sorteios de forma organizada.
* Divulgar automaticamente os resultados.
* Disponibilizar uma página pública para divulgação da rifa.

---

## 4. Funcionalidades Implementadas

### Área do Organizador

* Cadastro e login de usuários.
* Dashboard administrativo.
* Criação de rifas.
* Edição de rifas existentes.
* Exclusão de rifas.
* Visualização de todas as rifas criadas.
* Gerenciamento de vendedores.
* Moderação de comentários.
* Controle de pagamentos pendentes.
* Registro de pagamentos aprovados.
* Realização de sorteios.
* Divulgação dos resultados.

### Área do Participante

* Visualização pública da rifa.
* Seleção de números disponíveis.
* Reserva de números.
* Preenchimento de dados do comprador.
* Visualização do progresso da campanha.
* Envio de comentários.
* Consulta dos resultados dos sorteios.

### Sistema de Sorteio

* Cadastro de múltiplos prêmios.
* Sorteio de números vencedores.
* Registro dos ganhadores.
* Exibição pública dos resultados.

---

## 5. Tecnologias Utilizadas

### Frontend

* React
* React Router DOM
* Axios
* JavaScript (ES6+)
* HTML5
* CSS3

### Backend

* Python
* Django
* Django REST Framework

### Banco de Dados

* SQLite (ambiente de desenvolvimento)

### Ferramentas Auxiliares

* Git
* GitHub
* Visual Studio Code
* Postman

---

## 6. Arquitetura da Solução

O sistema segue uma arquitetura cliente-servidor:

### Frontend

Responsável pela interface do usuário, consumo das APIs REST e exibição dos dados.

### Backend

Responsável pelas regras de negócio, autenticação, gerenciamento das rifas, pagamentos, comentários e sorteios.

### Banco de Dados

Responsável pelo armazenamento das informações do sistema.

---

## 7. Instalação e Configuração

### Pré-requisitos

* Python 3.10+
* Node.js 18+
* npm
* Git

---

### Clonar o Projeto

```bash
git clone <url-do-repositorio>
cd projeto-rifas
```

---

### Backend

Entrar na pasta do backend:

```bash
cd backend
```

Criar ambiente virtual:

```bash
python -m venv venv
```

Ativar ambiente virtual:

Windows:

```bash
venv\Scripts\activate
```

Linux/Mac:

```bash
source venv/bin/activate
```

Instalar dependências:

```bash
pip install -r requirements.txt
```

Executar migrações:

```bash
python manage.py migrate
```

Iniciar servidor:

```bash
python manage.py runserver
```

Servidor disponível em:

```text
http://127.0.0.1:8000
```

---

### Frontend

Entrar na pasta do frontend:

```bash
cd frontend
```

Instalar dependências:

```bash
npm install
```

Executar aplicação:

```bash
npm run dev
```

Aplicação disponível em:

```text
http://localhost:5173
```

---

## 8. Principais Decisões Técnicas

Durante o desenvolvimento foram adotadas as seguintes decisões:

### Utilização do React

Foi escolhido React para construção da interface devido à sua componentização, reutilização de código e facilidade de manutenção.

### Utilização do Django REST Framework

O Django REST Framework foi adotado para disponibilizar APIs REST robustas, seguras e escaláveis.

### Separação Frontend e Backend

A arquitetura desacoplada permite maior flexibilidade de desenvolvimento e futuras integrações com aplicativos móveis ou outros sistemas.

### Sistema de Status dos Números

Os números da rifa possuem diferentes estados:

* Disponível
* Reservado
* Aguardando Aprovação
* Pago

Essa abordagem facilita o controle das vendas e reduz conflitos entre participantes.

### Página Pública

Foi criada uma página pública acessível por URL amigável (slug), permitindo divulgação sem necessidade de autenticação.

### Sistema de Comentários Moderados

Os comentários passam por moderação antes de serem exibidos, garantindo maior controle sobre o conteúdo publicado.

---

## 9. Resultados Obtidos

O sistema desenvolvido atende aos objetivos propostos, permitindo o gerenciamento completo de rifas online, desde a criação até a divulgação dos resultados.

A solução oferece:

* Centralização das informações;
* Maior transparência nos sorteios;
* Facilidade de uso para organizadores e participantes;
* Controle eficiente dos pagamentos;
* Divulgação automatizada dos resultados.

---

## 10. Autoria

Projeto desenvolvido como atividade acadêmica para a disciplina de Desenvolvimento Web.

Equipe responsável:

* Stephany Carvalho


---

## 📄 License

This project is for learning and development purposes.
