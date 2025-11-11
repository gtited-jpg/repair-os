import React, { useState } from 'react';
import Panel from './components/GlassPanel';
import Icon from './components/Icon';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import EulaModal from './components/EulaModal';

interface LoginViewProps {
  onLogin: (email: string, pass: string) => Promise<string | null>;
  onShowPortal: () => void;
  onGoogleLogin: () => void;
  onShowSignUp: () => void;
  loginError: string | null;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin, onShowPortal, onGoogleLogin, onShowSignUp, loginError }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isForgotPassOpen, setIsForgotPassOpen] = useState(false);
    const [isEulaOpen, setIsEulaOpen] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        await onLogin(email, password);
        setIsLoading(false);
    };

    return (
        <>
            <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <div className="text-center mb-8">
                     <div className="flex items-center justify-center space-x-3">
                        <svg 
                            className="w-10 h-10 text-dc-purple"
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M5.93,7.59,12,2,18.07,7.59,12,13.17Z" />
                            <path d="M12,15.22,16.65,11,18.07,12.41,12,18.48,5.93,12.41,7.35,11Z" />
                            <path d="M12,20.52,16.65,16,18.07,17.41,12,23.48,5.93,17.41,7.35,16Z" />
                        </svg>
                        <h1 className="text-5xl font-bold text-dc-text-primary font-display">
                            DaemonCore<span className="text-dc-purple">.</span>
                        </h1>
                   </div>
                   <p className="text-dc-text-secondary mt-2">Repair OS</p>
                </div>
                
                <Panel className="w-full max-w-md">
                    <div className="p-8 space-y-6">
                        <h2 className="text-2xl font-bold text-dc-text-primary text-center">Employee Login</h2>
                        {loginError && <p className="text-sm text-red-400 text-center bg-red-500/10 p-2 rounded-lg">{loginError}</p>}
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-dc-text-secondary mb-1">Email</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple" />
                            </div>
                            <div>
                                <div className="flex justify-between items-baseline">
                                    <label className="block text-sm font-medium text-dc-text-secondary mb-1">Password</label>
                                    <button type="button" onClick={() => setIsForgotPassOpen(true)} className="text-xs text-dc-text-secondary hover:text-dc-purple underline">Forgot?</button>
                                </div>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-dc-purple" />
                            </div>
                             <button type="submit" disabled={isLoading} className="w-full bg-dc-purple py-3 rounded-lg font-bold text-lg hover:bg-dc-purple/80 transition disabled:bg-dc-hover">
                                {isLoading ? 'Signing In...' : 'Sign In'}
                            </button>
                        </form>

                        <div className="flex items-center">
                          <div className="flex-1 border-t border-dc-border"></div>
                          <span className="px-4 text-xs text-dc-text-secondary">OR</span>
                          <div className="flex-1 border-t border-dc-border"></div>
                        </div>

                        <button
                          type="button"
                          onClick={onGoogleLogin}
                          className="w-full flex items-center justify-center space-x-3 bg-dc-hover py-3 rounded-lg font-semibold hover:bg-dc-input border border-dc-border transition"
                        >
                          <Icon name="google" className="w-5 h-5" />
                          <span>Sign in with Google</span>
                        </button>
                    </div>
                     <div className="p-4 text-center border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
                        <button onClick={onShowSignUp} className="text-sm text-dc-text-secondary hover:text-dc-purple transition">
                           Don't have an account? <span className="font-semibold underline">Sign Up</span>
                        </button>
                    </div>
                </Panel>

                <div className="text-center mt-6 space-y-2">
                    <button onClick={onShowPortal} className="text-sm text-dc-text-secondary hover:text-dc-purple transition underline">
                        Are you a customer? Check your repair status here.
                    </button>
                    <p className="text-xs text-dc-text-secondary/50">
                        By signing in, you agree to our <button onClick={() => setIsEulaOpen(true)} className="underline hover:text-white">EULA</button>.
                    </p>
                </div>
            </div>

            {isForgotPassOpen && <ForgotPasswordModal onClose={() => setIsForgotPassOpen(false)} />}
            {isEulaOpen && <EulaModal onClose={() => setIsEulaOpen(false)} />}
        </>
    );
};

export default LoginView;