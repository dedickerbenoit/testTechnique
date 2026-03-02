import { useTranslation } from "react-i18next";
import RegisterForm from "./components/RegisterForm";

function App() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-text-primary text-center mb-2">
          {t("register.title")}
        </h1>
        <p className="text-text-secondary text-center mb-8">
          {t("register.subtitle")}
        </p>
        <RegisterForm />
      </div>
    </div>
  );
}

export default App;
