export interface NavbarProps {
  onFeaturesClick: () => void;
  onHowItWorksClick: () => void;
  onBenefitsClick: () => void;
}

export interface NavItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface AuthItem {
  label: string;
  href: string;
  isPrimary?: boolean;
}

export const navItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Features" },
  { label: "How it works" },
  { label: "Why Us?" },
];

export const authItems: AuthItem[] = [
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register", isPrimary: true },
]; 