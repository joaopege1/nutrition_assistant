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
    "signupSuccess": "Conta criada com sucesso"
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
      "quantity": "Quantidade",
      "date": "Data",
      "isSafe": "É seguro?",
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
    "signupSuccess": "Account created successfully"
  },
  "dashboard": {
    "title": "Dashboard",
    "welcome": "Welcome",
    "welcomeMessage": "Welcome, {name}!",
    "userInfo": "User information",
    "role": "Role",
    "totalEntries": "Total entries",
    "safeEntries": "Safe entries",
    "unsafeEntries": "Unsafe entries",
    "foodEntries": "Food Entries",
    "noEntries": "No entries found.",
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
      "quantity": "Quantity",
      "date": "Date",
      "isSafe": "Is safe?",
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