import { Link } from 'react-router-dom';
import './Unkown.css';

function Unknown() {
    return (
        <div className="not-found-404">
            <div className="not-found-404__container">
                <div className="not-found-404__content">
                    <div className="not-found-404__number">
                        <span className="not-found-404__digit">4</span>
                        <span className="not-found-404__digit">0</span>
                        <span className="not-found-404__digit">4</span>
                    </div>
                    
                    <div className="not-found-404__message">
                        <h1>Oops! Page Not Found</h1>
                        <p>The page you're looking for doesn't exist or has been moved.</p>
                    </div>
                    
                    <div className="not-found-404__actions">
                        <Link to="/superadmin/dashboard" className="not-found-404__btn not-found-404__btn--primary">
                            <svg className="not-found-404__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                            </svg>
                            Go to Dashboard
                        </Link>
                        
                        <button className="not-found-404__btn not-found-404__btn--secondary" onClick={() => window.history.back()}>
                            <svg className="not-found-404__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 12H5M12 19l-7-7 7-7"/>
                            </svg>
                            Go Back
                        </button>
                    </div>
                    
                    <div className="not-found-404__help">
                        <p>Need help? Contact support or check the URL for typos.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Unknown;