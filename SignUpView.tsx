import React, { useState } from 'react';
import Panel from './components/GlassPanel';
import Icon from './components/Icon';

interface SignUpViewProps {
  onSignUp: (orgName: string, userName: string, email: string, pass: string) => Promise<string | null>;
  onShowLogin: () => void;
}

const SignUpView: React.FC<SignUpViewProps> = ({ onSignUp, onShowLogin }) => {
    const [orgName, setOrgName] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        setIsLoading(true);
        const err = await onSignUp(orgName, userName, email, password);
        if (err) {
            if (err.toLowerCase().includes('user already registered')) {
                setError('This email address is already in use.');
            } else {
                setError(err);
            }
            setIsLoading(false);
        } else {
            setIsLoading(false);
            setIsSubmitted(true);
        }
    };

    if (isSubmitted) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-4">
                 <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-dc-text-primary font-display">
                        Almost there...
                    </h1>
                </div>
                <Panel className="w-full max-w-md">
                    <div className="p-8 text-center">
                        <Icon name="checkCircle" className="w-16 h-16 text-green-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-dc-text-primary">Check your email</h3>
                        <p className="text-dc-text-secondary mt-2">We've sent a confirmation link to <strong className="text-dc-text-primary">{email}</strong>. Please click the link in the email to activate your account.</p>
                        <button onClick={onShowLogin} className="mt-6 w-full bg-dc-hover py-2.5 rounded-lg font-semibold hover:bg-dc-input transition">
                            Back to Login
                        </button>
                    </div>
                </Panel>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4">
            <div className="text-center mb-8">
                 <h1 className="text-5xl font-bold text-dc-text-primary font-display">
                    Join DaemonCore<span className="text-dc-purple">.</span>
                </h1>
               <p className="text-dc-text-secondary mt-2">Create an account for your business.</p>
            </div>
            
            <Panel className="w-full max-w-md">
                <form onSubmit={handleSignUp} className="p-8 space-y-4">
                    {error && <p className="text-sm text-red-400 text-center bg-red-500/10 p-2 rounded-lg">{error}</p>}
                    
                    <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Company Name</label>
                        <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Your Full Name</label>
                        <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-dc-text-secondary mb-1">Password</label>
                        {/* FIX: Corrected minLength prop to accept a number instead of a string to resolve TypeScript error. */}
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="w-full bg-dc-input border border-dc-border rounded-lg px-3 py-2.5" />
                    </div>
                    
                     <button type="submit" disabled={isLoading} className="w-full !mt-6 bg-dc-purple py-3 rounded-lg font-bold text-lg hover:bg-dc-purple/80 transition disabled:bg-dc-hover">
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                 <div className="p-4 text-center border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
                    <button onClick={onShowLogin} className="text-sm text-dc-text-secondary hover:text-dc-purple transition">
                       Already have an account? <span className="font-semibold underline">Sign In</span>
                    </button>
                </div>
            </Panel>
        </div>
    );
};

export default SignUpView;