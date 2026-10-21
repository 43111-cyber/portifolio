# Especificação de Funcionalidades — AdrielOS

## 1. Tela de Inicialização (Bootloader)
- **Apresentação:**
  - Logotipo animado em SVG do **AdrielOS**.
  - Barra de progresso com porcentagem dinâmica simulando o carregamento dos subsistemas (`Memória`, `Drivers Gráficos`, `Interface do Usuário`, `Projetos`).
  - Mensagem de status: `"Iniciando ambiente..."`.
  - Botão **"Pular Inicialização"** visível e acessível imediatamente para garantir que visitantes apressados acessem a área de trabalho sem fricção.
  - Transição elegante de opacidade e escala para a Área de Trabalho após o término do boot.

## 2. Área de Trabalho (Desktop Environment)
- **Área Útil:**
  - Ocupa 100% da viewport (computadores, tablets e smartphones).
  - Papel de parede dinâmico com suporte a alternância em tempo real.
- **Ícones do Desktop:**
  - `Sobre Adriel` (Identificação e perfil de estudante)
  - `Meus Projetos` (Explorador visual de projetos reais)
  - `Habilidades` (Painel de competências técnicas e interesses)
  - `Meu GitHub` (Explorador integrado e link oficial)
  - `Contato` (Formulário e canais diretos de comunicação)
  - `Lixeira` (Easter egg bem-humorado de projetos contínuos)
- **Interações dos Ícones:**
  - **Desktop (Mouse):** Clique simples para selecionar (destaque visual); Duplo clique para abrir a respectiva janela.
  - **Dispositivos Móveis (Touch):** Toque simples imediato abre a aplicação.
  - Efeito hover com elevação, sombra e iluminação neon.
  - Seleção no desktop com suporte a arrastar caixa de seleção ou clicar fora para desselecionar.

## 3. Gerenciador de Janelas (Window Management Engine)
- **Controles da Barra de Título:**
  - Botão Minimizar (esconde na barra de tarefas com animação).
  - Botão Maximizar / Restaurar (alterna entre tamanho padrão centralizado e tela cheia respeitando a barra de tarefas).
  - Botão Fechar (encerra a janela e remove o indicador da barra de tarefas).
- **Movimentação (Drag & Drop):**
  - Arraste livre através da barra de título (suporte completo a mouse e eventos touch em dispositivos móveis).
  - Limites de tela calculados: a janela não pode ser arrastada para fora do topo visível nem ficar soterrada pela barra de tarefas.
- **Foco e Empilhamento (Z-Index Stacking):**
  - Clicar em qualquer parte de uma janela traz-na imediatamente para o primeiro plano.
  - Títulos de janelas ativas recebem destaque visual enquanto as inativas ficam atenuadas.
- **Responsividade Móvel:**
  - Em telas menores que 768px, as janelas abrem automaticamente em modo ajustado à largura útil do dispositivo com botões de controle de fácil toque (mínimo de 44x44px de área de clique).

## 4. Aplicativos do Sistema

### 4.1. "Sobre Adriel"
- Avatar estilizado de estudante/desenvolvedor (sem fotos inventadas).
- Nome: Adriel Morback.
- Apresentação autêntica:
  > *"Olá! Meu nome é Adriel Morback. Sou estudante de Ensino Médio Técnico, gosto de criar sites, desenvolver projetos e aprender novas tecnologias. Também gosto muito de futebol. Este espaço reúne um pouco do que estou aprendendo e construindo."*
- Cartões de Interesse com ícones:
  - Desenvolvimento de sites
  - Programação
  - Projetos digitais
  - Futebol e análise tática

### 4.2. "Meus Projetos"
- Layout em grade de galeria/explorador com cartões ricos:
  - **BEIÇO STREET — Taça das Favelas Campinas:**
    - Jogo de futebol de rua 1v1 arcade para navegador construído com HTML5 Canvas e JavaScript puro.
    - Tecnologias: `HTML5`, `CSS3`, `JavaScript`, `Canvas API`.
    - Botão funcional direto: **"Abrir no GitHub"** ([https://github.com/43111-cyber/jogo-ste](https://github.com/43111-cyber/jogo-ste)).
  - **Apostila de Excel para Idosos:**
    - Material educacional acessível com tipografia clara e planilhas amigáveis para inclusão de idosos na informática básica.
    - Foco: Inclusão digital, ensino humanizado.
  - **Próximos Projetos (Em Desenvolvimento):**
    - Área reservada para futuros jogos, sites e sistemas, com badge indicando *"Em Construção"*.

### 4.3. "Minhas Habilidades"
- Categorias reais e declaradas:
  - **Criação de Sites:** HTML5 Semântico, CSS3 Moderno, Design Responsivo.
  - **Programação & Lógica:** JavaScript (ES6+), manipulação de DOM, Canvas 2D.
  - **Desenvolvimento de Sistemas:** Estruturação de projetos, controle de versão com Git & GitHub.
  - **Projetos Digitais & Ferramentas:** Ferramentas de escritório (Excel), design de interfaces, criação de materiais didáticos.
  - **Tecnologia & Futebol:** Lógica esportiva, desenvolvimento de jogos esportivos e torneios.
- *Observação rigorosa:* Sem certificações ou porcentagens fictícias.

### 4.4. "GitHub Explorer"
- Visual de terminal / explorador de repositório.
- Exibição detalhada do projeto `jogo-ste` do usuário `43111-cyber`.
- Links diretos e confirmados:
  - Repositório: [https://github.com/43111-cyber/jogo-ste](https://github.com/43111-cyber/jogo-ste)
  - Perfil no GitHub: [https://github.com/43111-cyber](https://github.com/43111-cyber)

### 4.5. "Contato"
- Dados diretos de contato:
  - Nome: Adriel Morback
  - E-mail: `adriel.morback@gmail.com`
  - WhatsApp: `+55 19 97422-6148`
- Botões de Ação Imediata:
  - **"Enviar e-mail"**: Dispara link `mailto:adriel.morback@gmail.com`.
  - **"Conversar no WhatsApp"**: Abre conversa direta em `https://wa.me/5519974226148`.
  - **"Ver GitHub"**: Redireciona para o perfil no GitHub.
- Formulário Integrado:
  - Campos: Nome, E-mail, Assunto e Mensagem.
  - Validação em tempo real (email válido, campos obrigatórios preenchidos).
  - Feedback visual transparente avisando que a mensagem foi validada e orientando sobre os canais diretos.

### 4.6. "Lixeira"
- Janela bem-humorada com ilustração minimalista e texto:
  > *"Nenhum arquivo descartado. Todos os projetos continuam em construção!"*
- Botão lúdico *"Esvaziar Lixeira"* com mensagem amigável.

## 5. Barra de Tarefas (Taskbar)
- Fixa na parte inferior da tela com visual de vidro fosco moderno.
- **Botão Iniciar:** Ativa/desativa o Menu Iniciar com animação.
- **Ícones Pinned / Em Execução:**
  - Cada aplicativo aberto gera um ícone correspondente na barra.
  - Indicador luminoso (dot verde neon) mostrando o status do app.
  - Clicar no ícone de uma janela minimizada restaura-a e traz para frente.
  - Clicar no ícone da janela ativa minimiza-a.
- **Bandeja do Sistema (System Tray):**
  - Alternador de Áudio/Efeitos sonoros sutis.
  - Alternador de Tema rápido.
  - Ícone de status de conexão simulada (Online).
  - Relógio digital atualizado a cada segundo (`HH:MM:SS`) e data (`DD/MM/AAAA`).
  - Notificações de boas-vindas e ações do sistema (toasts).

## 6. Menu Iniciar & Pesquisa Integrada
- Cabeçalho com perfil de **Adriel Morback** e badge de sistema.
- **Barra de Pesquisa Funcional em Tempo Real:**
  - Ao digitar o nome de um app (ex: "pro", "git", "con", "hab"), filtra instantaneamente os resultados.
  - Mensagem de "Nenhum aplicativo encontrado" se a busca não corresponder a nenhum app.
- Lista completa de aplicativos com atalhos para abertura em 1 clique.
- Ações do sistema: Alternar Papel de Parede, Alternar Tema, Reiniciar AdrielOS.

## 7. Menu de Contexto (Botão Direito)
- Clicar com botão direito em qualquer área livre do desktop abre o menu de contexto:
  - *Atualizar Área de Trabalho*
  - *Trocar Papel de Parede* (cicla entre os temas disponíveis)
  - *Abrir Meus Projetos*
  - *Sobre o AdrielOS*

## 8. Acessibilidade e Teclado
- Tecla `Escape`: Fecha o Menu Iniciar, Menu de Contexto ou a janela ativa no topo.
- Navegação por foco acessível (`tabindex` bem configurado).
- Contrastes e legibilidade atendendo às diretrizes de acessibilidade na web.
