(function injectFormStyles() {
    if (document.getElementById('logreg-style')) return;

    const css = `
    .input-wrap input.invalid {
        border-color: #ef4444 !important;
        background: #fff5f5 !important;
        animation: shakeInput .35s ease;
    }
    @keyframes shakeInput {
        0%,100% { transform: translateX(0); }
        20%,60%  { transform: translateX(-5px); }
        40%,80%  { transform: translateX(5px); }
    }

    .field-error {
        display: block;
        font-size: .78rem;
        color: #ef4444;
        font-weight: 500;
        margin-top: .3rem;
        min-height: 1rem;
        opacity: 0;
        transform: translateY(-4px);
        transition: opacity .2s ease, transform .2s ease;
    }
    .field-error.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .pw-strength {
        margin-top: .6rem;
        display: flex;
        align-items: center;
        gap: .65rem;
    }
    .pw-strength-bar {
        flex: 1;
        height: 5px;
        background: #e2e8f0;
        border-radius: 99px;
        overflow: hidden;
    }
    .pw-strength-fill {
        height: 100%;
        width: 0;
        border-radius: 99px;
        background: #ef4444;
        transition: width .35s ease, background .35s ease;
    }
    .pw-strength-label {
        font-size: .72rem;
        font-weight: 600;
        white-space: nowrap;
        min-width: 80px;
    }

    .form-row-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
    }
    @media (max-width: 480px) {
        .form-row-2 { grid-template-columns: 1fr; }
    }

    #termsError {
        display: block;
        font-size: .78rem;
        color: #ef4444;
        font-weight: 500;
        margin-top: .25rem;
        min-height: 1rem;
        opacity: 0;
        transform: translateY(-4px);
        transition: opacity .2s ease, transform .2s ease;
    }
    #termsError.visible {
        opacity: 1;
        transform: translateY(0);
    }

    .terms-label a {
        color: #3b5bdb;
        text-decoration: underline;
        font-weight: 600;
    }
    .terms-label a:hover { color: #2f4ac4; }

    .btn-spinner {
        display: inline-block;
        animation: spin .8s linear infinite;
        font-style: normal;
    }
    @keyframes spin {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
    }
    `;

    const style = document.createElement('style');
    style.id = 'logreg-style';
    style.textContent = css;
    document.head.appendChild(style);
})();