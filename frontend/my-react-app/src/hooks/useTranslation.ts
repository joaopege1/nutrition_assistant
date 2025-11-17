import React, { useState, createContext, useContext } from 'react';
import type { ReactNode } from 'react';

type Language = 'pt' | 'en';

interface TranslationContextType {
  t: (key: string, params?: Record<string, any>) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
  availableLanguages: { code: Language; name: string }[];
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const ptTranslations = {
  "common": {
    "loading": "Carregando...",
    "error": "Erro",
    "success": "Sucesso",
    "cancel": "Cancelar",
    "save": "Salvar",
    "edit": "Editar",
    "delete": "Excluir",
    "confirm": "Confirmar",
    "close": "Fechar",
    "yes": "Sim",
    "no": "Não"
  },
  "auth": {
    "login": "Entrar",
    "signup": "Cadastrar",
    "logout": "Sair",
    "username": "Nome de usuário",
    "password": "Senha",
    "confirmPassword": "Confirmar senha",
    "fullName": "Nome completo",
    "role": "Tipo de usuário",
    "user": "Usuário",
    "admin": "Administrador",
    "loginTitle": "Faça login",
    "loginSubtitle": "Entre com suas credenciais",
    "signupTitle": "Criar conta",
    "signupSubtitle": "Preencha os dados para se cadastrar",
    "alreadyHaveAccount": "Já tem conta?",
    "dontHaveAccount": "Não tem conta?",
    "loginHere": "Faça login",
    "signupHere": "Cadastre-se",
    "loginError": "Erro ao fazer login",
    "signupError": "Erro ao criar conta",
    "loginSuccess": "Login realizado com sucesso",
    "signupSuccess": "Conta criada com sucesso",
    "passwordMismatch": "Senhas não coincidem!",
    "passwordTooShort": "A senha deve ter pelo menos 6 caracteres!"
  },
  "dashboard": {
    "title": "Dashboard",
    "welcome": "Bem-vindo,",
    "welcomeMessage": "Bem-vindo, {name}!",
    "userInfo": "Informações do usuário",
    "role": "Função",
    "totalEntries": "Total de Comidas",
    "safeEntries": "Comidas Seguras",
    "unsafeEntries": "Comidas Não Seguras",
    "foodEntries": "Comidas Registradas",
    "noEntries": "Nenhuma Comida Encontrada.",
    "addEntry": "Nova Entrada",
    "user": "Usuário",
    "food": "Comida",
    "quantity": "Quantidade",
    "date": "Data",
    "safe": "Seguro",
    "unsafe": "Perigoso",
    "actions": "Ações",
    "invalidDate": "Data inválida",
    "noDate": "Sem data"
  },
  "forms": {
    "foodEntry": {
      "title": "Entrada de Comida",
      "user": "Usuário",
      "food": "Comida",
      "foodPlaceholder": "Nome da comida",
      "quantity": "Quantidade",
      "date": "Data",
      "isSafe": "É seguro?",
      "safe": "SEGURO",
      "unsafe": "NÃO SEGURO",
      "create": "Criar Entrada",
      "update": "Atualizar Entrada",
      "creating": "Criando entrada...",
      "updating": "Atualizando entrada...",
      "success": "Entrada criada com sucesso",
      "updateSuccess": "Entrada atualizada com sucesso",
      "error": "Erro ao criar entrada",
      "updateError": "Erro ao atualizar entrada"
    }
  },
  "language": {
    "select": "Selecionar idioma",
    "portuguese": "Português",
    "english": "English"
  },
  "admin": {
    "userManagement": "Gerenciar Usuários",
    "userManagementSubtitle": "Promover usuários a administradores ou rebaixar administradores",
    "backToDashboard": "Voltar ao Dashboard",
    "manageUsers": "Gerenciar Usuários",
    "userList": "Lista de Usuários",
    "noUsers": "Nenhum usuário encontrado",
    "administrator": "Administrador",
    "user": "Usuário Normal",
    "active": "Ativo",
    "inactive": "Inativo",
    "changeRole": "Alterar permissão",
    "roleUpdated": "Permissão atualizada com sucesso",
    "roleUpdateError": "Erro ao atualizar permissão do usuário",
    "loadUsersError": "Erro ao carregar usuários",
    "confirmRoleChange": "Tem certeza que deseja alterar a permissão deste usuário para {role}?",
    "accessDenied": "Acesso negado. Apenas administradores podem acessar esta página.",
    "loadingUsers": "Carregando usuários..."
  },
  "landing": {
    "appName": "Nutrition Assistant - Food Tracking",
    "appTagline": "Monitore sua saúde intestinal de forma inteligente",
    "aboutTitle": "Sobre o Aplicativo",
    "aboutDescription1": "O Nutrition Assistant - Food Tracking é uma ferramenta completa para ajudar você a gerenciar sua saúde intestinal. Com ele, você pode registrar suas refeições, identificar alimentos seguros e inseguros para seu organismo, e acompanhar padrões ao longo do tempo.",
    "aboutDescription2": "Nossa plataforma permite que você tome decisões informadas sobre sua dieta, melhore sua qualidade de vida e compartilhe informações relevantes com profissionais de saúde quando necessário.",
    "diseasesTitle": "Entendendo as Doenças Intestinais",
    "diseasesIntro": "Doenças intestinais afetam milhões de pessoas em todo o mundo e podem impactar significativamente a qualidade de vida. Entender essas condições é o primeiro passo para gerenciá-las efetivamente:",
    "ibd": "Doença Inflamatória Intestinal (DII)",
    "ibdDescription": "Inclui Doença de Crohn e Retocolite Ulcerativa (RCU). Condições crônicas que causam inflamação do trato gastrointestinal, levando a sintomas como dor abdominal, diarreia e fadiga.",
    "ibs": "Síndrome do Intestino Irritável (SII)",
    "ibsDescription": "Distúrbio funcional que afeta o intestino grosso, causando desconforto abdominal, inchaço, e mudanças nos hábitos intestinais sem danos visíveis ao trato digestivo.",
    "celiac": "Doença Celíaca",
    "celiacDescription": "Condição autoimune em que a ingestão de glúten causa danos ao intestino delgado. Requer uma dieta estritamente livre de glúten para prevenir sintomas e complicações.",
    "foodIntolerance": "Intolerâncias Alimentares",
    "foodIntoleranceDescription": "Dificuldade em digerir certos alimentos, como lactose ou frutose, que pode causar sintomas gastrointestinais desconfortáveis.",
    "diseasesConclusion": "Com o Nutrition Assistant - Food Tracking, você pode identificar seus gatilhos alimentares pessoais e gerenciar melhor sua condição intestinal, seja ela qual for.",
    "getStarted": "Começar Agora",
    "signupPrompt": "Ainda não tem conta?",
    "signupLink": "Cadastre-se gratuitamente"
  }
};

const enTranslations = {
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "cancel": "Cancel",
    "save": "Save",
    "edit": "Edit",
    "delete": "Delete",
    "confirm": "Confirm",
    "close": "Close",
    "yes": "Yes",
    "no": "No"
  },
  "auth": {
    "login": "Login",
    "signup": "Sign Up",
    "logout": "Logout",
    "username": "Username",
    "password": "Password",
    "confirmPassword": "Confirm password",
    "fullName": "Full name",
    "role": "User type",
    "user": "User",
    "admin": "Administrator",
    "loginTitle": "Login",
    "loginSubtitle": "Enter your credentials",
    "signupTitle": "Create account",
    "signupSubtitle": "Fill in the data to register",
    "alreadyHaveAccount": "Already have an account?",
    "dontHaveAccount": "Don't have an account?",
    "loginHere": "Login here",
    "signupHere": "Sign up here",
    "loginError": "Login error",
    "signupError": "Error creating account",
    "loginSuccess": "Login successful",
    "signupSuccess": "Account created successfully",
    "passwordMismatch": "Passwords do not match!",
    "passwordTooShort": "Password must be at least 6 characters!",
    "backToHome": "Back to Home"
  },
  "dashboard": {
    "title": "Dashboard",
    "welcome": "Welcome",
    "welcomeMessage": "Welcome, {name}!",
    "userInfo": "User information",
    "role": "Role",
    "totalEntries": "Total Entries",
    "safeEntries": "Safe Entries",
    "unsafeEntries": "Unsafe Entries",
    "foodEntries": "Food Entries",
    "noEntries": "No Entries Found.",
    "addEntry": "New Entry",
    "user": "User",
    "food": "Food",
    "quantity": "Quantity",
    "date": "Date",
    "safe": "Safe",
    "unsafe": "Unsafe",
    "actions": "Actions",
    "invalidDate": "Invalid date",
    "noDate": "No date"
  },
  "forms": {
    "foodEntry": {
      "title": "Food Entry",
      "user": "User",
      "food": "Food",
      "foodPlaceholder": "Food name",
      "quantity": "Quantity",
      "date": "Date",
      "isSafe": "Is safe?",
      "safe": "SAFE",
      "unsafe": "UNSAFE",
      "create": "Create Entry",
      "update": "Update Entry",
      "creating": "Creating entry...",
      "updating": "Updating entry...",
      "success": "Entry created successfully",
      "updateSuccess": "Entry updated successfully",
      "error": "Error creating entry",
      "updateError": "Error updating entry"
    }
  },
  "language": {
    "select": "Select language",
    "portuguese": "Português",
    "english": "English"
  },
  "admin": {
    "userManagement": "Manage Users",
    "userManagementSubtitle": "Promote users to administrators or demote administrators",
    "backToDashboard": "Back to Dashboard",
    "manageUsers": "Manage Users",
    "userList": "User List",
    "noUsers": "No users found",
    "administrator": "Administrator",
    "user": "Regular User",
    "active": "Active",
    "inactive": "Inactive",
    "changeRole": "Change permission",
    "roleUpdated": "Permission updated successfully",
    "roleUpdateError": "Error updating user permission",
    "loadUsersError": "Error loading users",
    "confirmRoleChange": "Are you sure you want to change this user's permission to {role}?",
    "accessDenied": "Access denied. Only administrators can access this page.",
    "loadingUsers": "Loading users..."
  },
  "landing": {
    "appName": "Nutrition Assistant - Food Tracking",
    "appTagline": "Monitor your intestinal health intelligently",
    "aboutTitle": "About the App",
    "aboutDescription1": "Nutrition Assistant - Food Tracking is a comprehensive tool to help you manage your intestinal health. With it, you can log your meals, identify safe and unsafe foods for your body, and track patterns over time.",
    "aboutDescription2": "Our platform allows you to make informed decisions about your diet, improve your quality of life, and share relevant information with healthcare professionals when needed.",
    "diseasesTitle": "Understanding Intestinal Diseases",
    "diseasesIntro": "Intestinal diseases affect millions of people worldwide and can significantly impact quality of life. Understanding these conditions is the first step to managing them effectively:",
    "ibd": "Inflammatory Bowel Disease (IBD)",
    "ibdDescription": "Includes Crohn's Disease and Ulcerative Colitis (UC). Chronic conditions that cause inflammation of the gastrointestinal tract, leading to symptoms like abdominal pain, diarrhea, and fatigue.",
    "ibs": "Irritable Bowel Syndrome (IBS)",
    "ibsDescription": "A functional disorder affecting the large intestine, causing abdominal discomfort, bloating, and changes in bowel habits without visible damage to the digestive tract.",
    "celiac": "Celiac Disease",
    "celiacDescription": "An autoimmune condition where gluten ingestion causes damage to the small intestine. Requires a strictly gluten-free diet to prevent symptoms and complications.",
    "foodIntolerance": "Food Intolerances",
    "foodIntoleranceDescription": "Difficulty digesting certain foods, such as lactose or fructose, which can cause uncomfortable gastrointestinal symptoms.",
    "diseasesConclusion": "With Nutrition Assistant - Food Tracking, you can identify your personal food triggers and better manage your intestinal condition, whatever it may be.",
    "getStarted": "Get Started",
    "signupPrompt": "Don't have an account yet?",
    "signupLink": "Sign up for free"
  }
};

const translations = {
  pt: ptTranslations,
  en: enTranslations,
};

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'pt';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string, params?: Record<string, any>): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key "${key}" not found for language "${language}"`);
        return key;
      }
    }
    
    if (typeof value !== 'string') {
      return key;
    }
    
    // Interpolação de variáveis
    if (params) {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }
    
    return value;
  };

  const availableLanguages = [
    { code: 'pt' as Language, name: 'Português' },
    { code: 'en' as Language, name: 'English' },
  ];

  return React.createElement(
    TranslationContext.Provider,
    { value: { t, language, setLanguage, availableLanguages } },
    children
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};