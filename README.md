# 🚨 RodoSOS — Sistema de Emergências Rodoviárias

![Build](https://img.shields.io/badge/build-passing-brightgreen)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-yellow)

> **RodoSOS** é um app web de emergência rodoviária que permite aos usuários abrir chamados de socorro em tempo real, com captura automática de GPS, comunicação via texto, voz e vídeo com a central de atendimento.

---

## 🛣️ Visão Geral

O RodoSOS foi desenvolvido para modernizar e agilizar o atendimento de ocorrências em rodovias. Com uma interface intuitiva e responsiva, qualquer motorista consegue acionar a central de emergência em segundos — mesmo em situações de estresse.

### Principais Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| 📋 **Abertura de Chamado** | Formulário com nome, celular e tipo de ocorrência |
| 📍 **GPS Automático** | Captura de latitude e longitude via `navigator.geolocation` |
| 🎙️ **Gravação de Voz** | Ditado da descrição via Web Speech API (pt-BR) |
| 💬 **Chat em Tempo Real** | Troca de mensagens com a central de atendimento |
| 🎥 **Vídeo ao Vivo** | Stream de câmera via `getUserMedia` |
| ⏺️ **Gravação de Vídeo** | Gravação e download via `MediaRecorder API` |
| 🚑 **Atalhos de Emergência** | Ligação direta para 190 (PRF) e 192 (SAMU) |

### Paleta de Cores

Inspirada nas faixas das rodovias brasileiras:

| Cor | Hex | Uso |
|---|---|---|
| 🖤 Asfalto | `#0D0D0D` | Fundo principal |
| 💛 Amarelo Faixa | `#FFD700` | Destaques e CTAs |
| 🤍 Branco | `#FFFFFF` | Textos e detalhes |
| 🔴 Emergência | `#FF1E1E` | Botão SOS e alertas |

---

## 🚀 Instalação

### Pré-requisitos

- **Node.js** v18 ou superior
- **npm** v9 ou superior

### Passos

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>
cd app_rodovia

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

O app estará disponível em **http://localhost:5173**

---

## 🖥️ Uso

### Fluxo Principal

```
Home (/)  →  Formulário (/chamado)  →  Sala de Atendimento (/atendimento)
```

1. **Home** — Pressione o botão **SOS** vermelho para iniciar um chamado
2. **Formulário** — Preencha nome, celular e tipo de ocorrência; o GPS é capturado automaticamente
3. **Sala de Atendimento** — Comunique-se via chat, ative câmera/microfone e grave o atendimento

### Comandos npm

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Gera bundle de produção em /dist
npm run preview  # Visualiza o build de produção
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

O projeto não requer variáveis de ambiente para funcionar em desenvolvimento.

Para produção, configure no seu servidor:

```env
# URL base da API da central (futura integração)
VITE_API_URL=https://api.rodosos.com.br
```

### Permissões do Navegador

O app solicita as seguintes permissões ao usuário:

| Permissão | Motivo |
|---|---|
| 📍 Localização | Capturar GPS automaticamente |
| 🎙️ Microfone | Gravação de voz e reconhecimento de fala |
| 📷 Câmera | Stream de vídeo para a central |

---

## 🗂️ Estrutura do Projeto

```
src/
├── hooks/
│   ├── useGeolocation.ts        # Hook para captura de GPS
│   ├── useMediaRecorder.ts      # Hook para gravação de vídeo
│   └── useSpeechRecognition.ts  # Hook para reconhecimento de voz
├── components/
│   ├── SOSButton.tsx            # Botão SOS animado com radar
│   ├── GPSStatus.tsx            # Indicador de localização em tempo real
│   ├── CallTimer.tsx            # Cronômetro do chamado
│   └── IncidentBadge.tsx        # Badge do tipo de ocorrência
├── pages/
│   ├── Home.tsx                 # Tela inicial com botão SOS
│   ├── NewCall.tsx              # Formulário de abertura de chamado
│   └── AttendanceRoom.tsx       # Sala de atendimento (chat + vídeo)
├── types/
│   └── index.ts                 # Tipos e constantes globais
├── App.tsx                      # Roteamento principal
├── main.tsx                     # Entry point
└── index.css                    # Design system (tokens, animações)
```

---

## 🤝 Contribuição

1. Faça um **fork** do repositório
2. Crie uma branch para sua feature: `git checkout -b feature/minha-feature`
3. Commit suas mudanças: `git commit -m 'feat: adiciona minha feature'`
4. Faça push para a branch: `git push origin feature/minha-feature`
5. Abra um **Pull Request**

### Padrões de Código

- TypeScript estrito — sem `any` implícito
- Componentes funcionais com hooks
- CSS via design tokens (variáveis CSS) — evite estilos inline ad-hoc
- Commits seguindo [Conventional Commits](https://www.conventionalcommits.org/pt-br/)

---

## 🛠️ Stack Tecnológica

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 18 | Framework UI |
| Vite | 8 | Build tool |
| TypeScript | 5 | Tipagem estática |
| Tailwind CSS | 4 | Utilitários de estilo |
| React Router | 7 | Navegação entre páginas |
| Lucide React | latest | Ícones |
| Web APIs nativas | — | GPS, Câmera, Voz, Gravação |

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** — veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<div align="center">
  <strong>🚨 RodoSOS</strong> — Desenvolvido com ❤️ para segurança nas estradas brasileiras
</div>
