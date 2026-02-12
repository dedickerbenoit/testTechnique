import RegisterForm from './components/RegisterForm'

function App() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-text-primary text-center mb-2">
          Inscription
        </h1>
        <p className="text-text-secondary text-center mb-8">
          Créez votre compte Culture et Formation
        </p>
        <RegisterForm />
      </div>
    </div>
  )
}

export default App
