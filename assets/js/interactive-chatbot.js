/**
 * Signova Interactive Chatbot Widget
 * Provides real-time conversational support
 * Version: 1.0.0
 */

class SignovaChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.currentContext = null;
        this.userProfile = null;
        this.chatWidget = null;
        this.messageContainer = null;
        this.inputField = null;
        this.isTyping = false;
        
        this.init();
    }
    
    init() {
        this.createChatWidget();
        this.setupEventListeners();
        this.loadUserContext();
        this.initializeGreeting();
        
        console.log('💬 Signova Chatbot initialized');
    }
    
    createChatWidget() {
        // Create chat widget container
        this.chatWidget = document.createElement('div');
        this.chatWidget.id = 'signova-chatbot';
        this.chatWidget.className = 'signova-chatbot-widget';
        this.chatWidget.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            height: 500px;
            max-width: calc(100vw - 40px);
            max-height: calc(100vh - 40px);
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: saturate(180%) blur(20px);
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateY(100%) scale(0.8);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        `;
        
        // Create chat header
        const header = document.createElement('div');
        header.className = 'chatbot-header';
        header.style.cssText = `
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 1rem 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-radius: 20px 20px 0 0;
        `;
        
        header.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">🤖</div>
                <div>
                    <div style="font-weight: 600; font-size: 1rem;">Signova Assistant</div>
                    <div style="font-size: 0.8rem; opacity: 0.9;" id="chatbot-status">Online • Ready to help</div>
                </div>
            </div>
            <button onclick="signovaChatbot.closeChatWidget()" style="background: none; border: none; color: white; cursor: pointer; opacity: 0.8; font-size: 1.5rem; padding: 4px;">×</button>
        `;
        
        // Create messages container
        this.messageContainer = document.createElement('div');
        this.messageContainer.className = 'chatbot-messages';
        this.messageContainer.style.cssText = `
            flex: 1;
            padding: 1rem;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 1rem;
            scroll-behavior: smooth;
        `;
        
        // Create input container
        const inputContainer = document.createElement('div');
        inputContainer.className = 'chatbot-input-container';
        inputContainer.style.cssText = `
            padding: 1rem 1.5rem;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            background: rgba(248, 250, 252, 0.8);
            display: flex;
            gap: 12px;
            align-items: center;
        `;
        
        // Create input field
        this.inputField = document.createElement('input');
        this.inputField.type = 'text';
        this.inputField.placeholder = 'Type your message...';
        this.inputField.className = 'chatbot-input';
        this.inputField.style.cssText = `
            flex: 1;
            padding: 12px 16px;
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 25px;
            background: white;
            font-size: 0.9rem;
            outline: none;
            transition: all 0.2s ease;
        `;
        
        // Create send button
        const sendButton = document.createElement('button');
        sendButton.className = 'chatbot-send-btn';
        sendButton.innerHTML = '📤';
        sendButton.style.cssText = `
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            border: none;
            border-radius: 50%;
            color: white;
            cursor: pointer;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        `;
        
        sendButton.onclick = () => this.sendMessage();
        
        // Add input event listeners
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        this.inputField.addEventListener('focus', () => {
            this.inputField.style.borderColor = '#2563eb';
            this.inputField.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
        });
        
        this.inputField.addEventListener('blur', () => {
            this.inputField.style.borderColor = 'rgba(0, 0, 0, 0.1)';
            this.inputField.style.boxShadow = 'none';
        });
        
        sendButton.addEventListener('mouseenter', () => {
            sendButton.style.transform = 'scale(1.05)';
        });
        
        sendButton.addEventListener('mouseleave', () => {
            sendButton.style.transform = 'scale(1)';
        });
        
        // Assemble the widget
        inputContainer.appendChild(this.inputField);
        inputContainer.appendChild(sendButton);
        
        this.chatWidget.appendChild(header);
        this.chatWidget.appendChild(this.messageContainer);
        this.chatWidget.appendChild(inputContainer);
        
        document.body.appendChild(this.chatWidget);
        
        // Add mobile responsive styles
        this.addMobileStyles();
    }
    
    addMobileStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .signova-chatbot-widget {
                    width: calc(100vw - 20px) !important;
                    height: calc(100vh - 100px) !important;
                    bottom: 10px !important;
                    right: 10px !important;
                    left: 10px !important;
                    margin: 0 auto;
                }
                
                .chatbot-messages {
                    padding: 0.75rem !important;
                }
                
                .chatbot-input-container {
                    padding: 0.75rem 1rem !important;
                }
                
                .chatbot-input {
                    font-size: 16px !important; /* Prevents zoom on iOS */
                }
            }
            
            .chatbot-messages::-webkit-scrollbar {
                width: 4px;
            }
            
            .chatbot-messages::-webkit-scrollbar-track {
                background: transparent;
            }
            
            .chatbot-messages::-webkit-scrollbar-thumb {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 2px;
            }
        `;
        document.head.appendChild(style);
    }
    
    setupEventListeners() {
        // Listen for chat open requests
        window.openSupportChat = () => this.openChatWidget();
        
        // Listen for escape key to close chat
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeChatWidget();
            }
        });
        
        // Listen for outside clicks to close chat
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.chatWidget.contains(e.target)) {
                const notifications = document.querySelectorAll('.ai-smart-notification');
                let clickedNotification = false;
                notifications.forEach(notification => {
                    if (notification.contains(e.target)) {
                        clickedNotification = true;
                    }
                });
                
                if (!clickedNotification) {
                    this.closeChatWidget();
                }
            }
        });
    }
    
    loadUserContext() {
        // Get user context from URL parameters or local storage
        const urlParams = new URLSearchParams(window.location.search);
        this.userProfile = {
            email: urlParams.get('email') || localStorage.getItem('userEmail') || null,
            name: urlParams.get('name') || localStorage.getItem('userName') || null,
            plan: localStorage.getItem('userPlan') || 'Professional'
        };
        
        this.currentContext = {
            page: window.location.pathname,
            title: document.title,
            timestamp: Date.now()
        };
    }
    
    initializeGreeting() {
        // Add initial greeting message
        setTimeout(() => {
            this.addBotMessage(this.getContextualGreeting());
            this.addQuickActions();
        }, 500);
    }
    
    getContextualGreeting() {
        const currentPage = window.location.pathname;
        const userName = this.userProfile?.name || 'there';
        
        if (currentPage.includes('register')) {
            return `Hi ${userName}! 👋 I'm here to help you with registration. Need assistance choosing a plan or filling out the form?`;
        } else if (currentPage.includes('pricing')) {
            return `Hello ${userName}! 💰 Looking at our pricing plans? I can help you find the perfect plan for your needs.`;
        } else if (currentPage.includes('portal')) {
            return `Welcome back ${userName}! 🚀 How can I help you make the most of your Signova dashboard today?`;
        } else {
            return `Hi ${userName}! 👋 I'm your Signova AI assistant. How can I help you get the most out of our platform today?`;
        }
    }
    
    addQuickActions() {
        const quickActions = document.createElement('div');
        quickActions.className = 'chatbot-quick-actions';
        quickActions.style.cssText = `
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 12px;
        `;
        
        const actions = this.getContextualQuickActions();
        actions.forEach(action => {
            const button = document.createElement('button');
            button.textContent = action.text;
            button.style.cssText = `
                background: rgba(37, 99, 235, 0.1);
                color: #2563eb;
                border: 1px solid rgba(37, 99, 235, 0.2);
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 0.8rem;
                cursor: pointer;
                transition: all 0.2s ease;
            `;
            
            button.addEventListener('click', () => {
                this.handleQuickAction(action.action);
            });
            
            button.addEventListener('mouseenter', () => {
                button.style.background = 'rgba(37, 99, 235, 0.2)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.background = 'rgba(37, 99, 235, 0.1)';
            });
            
            quickActions.appendChild(button);
        });
        
        this.messageContainer.appendChild(quickActions);
        this.scrollToBottom();
    }
    
    getContextualQuickActions() {
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('register')) {
            return [
                { text: '💡 Help me choose a plan', action: 'plan_comparison' },
                { text: '📝 Registration help', action: 'registration_help' },
                { text: '💳 Payment questions', action: 'payment_help' }
            ];
        } else if (currentPage.includes('pricing')) {
            return [
                { text: '🔍 Compare plans', action: 'plan_comparison' },
                { text: '💼 Enterprise features', action: 'enterprise_info' },
                { text: '🎯 Best plan for me', action: 'plan_recommendation' }
            ];
        } else if (currentPage.includes('portal')) {
            return [
                { text: '🚀 Getting started', action: 'getting_started' },
                { text: '📊 Dashboard tour', action: 'dashboard_tour' },
                { text: '⬆️ Upgrade my plan', action: 'upgrade_help' }
            ];
        } else {
            return [
                { text: '🔍 Learn about features', action: 'features_info' },
                { text: '💰 View pricing', action: 'pricing_info' },
                { text: '📞 Contact support', action: 'contact_support' }
            ];
        }
    }
    
    handleQuickAction(action) {
        let response = '';
        
        switch (action) {
            case 'plan_comparison':
                response = `Here's a quick comparison of our plans:

**Professional ($29/month):**
✅ 1,000 documents/month
✅ AI document generation
✅ Basic analytics
✅ Email support

**Business ($79/month):**
✅ 5,000 documents/month
✅ Advanced AI features
✅ Advanced analytics
✅ Priority support
✅ Team collaboration

**Enterprise ($199/month):**
✅ Unlimited documents
✅ Custom AI models
✅ Advanced security
✅ 24/7 phone support
✅ API access
✅ Custom integrations

Which plan interests you most?`;
                break;
                
            case 'registration_help':
                response = `I'll help you with registration! Here's what you need:

1. **Work Email** - Use your business email
2. **Company Name** - Your organization name
3. **Company Size** - Select your team size
4. **Plan Selection** - Choose your preferred plan
5. **Payment Info** - Credit card required (even for free trial)

Having trouble with any of these steps?`;
                break;
                
            case 'payment_help':
                response = `Payment questions? I've got you covered! 💳

**Free Trial:** Credit card required but no charge for 14 days
**Payment Methods:** Credit card, PayPal, Apple Pay
**Security:** All payments processed securely through Stripe
**Billing:** Monthly billing, cancel anytime
**Refunds:** 30-day money-back guarantee

Need help with a specific payment issue?`;
                break;
                
            case 'enterprise_info':
                response = `Enterprise features include:

🔒 **Advanced Security:** SOC 2 compliance, SSO integration
🤖 **Custom AI Models:** Trained on your specific data
📞 **24/7 Support:** Phone support with dedicated account manager
🔧 **API Access:** Full REST API for integrations
⚙️ **Custom Integrations:** Built specifically for your workflow
📊 **Advanced Analytics:** Custom reporting and insights
🏢 **White-label Options:** Brand the platform as your own

Ready to discuss Enterprise pricing?`;
                break;
                
            case 'getting_started':
                response = `Welcome to Signova! Let's get you started:

1. **Upload Your First Document** 📄
2. **Try AI Generation** 🤖
3. **Explore Templates** 📋
4. **Set Up Team Access** 👥
5. **Configure Workflows** ⚙️

Which would you like to try first?`;
                break;
                
            case 'contact_support':
                response = `I'd be happy to connect you with our support team! 📞

**Live Chat:** Right here with me!
**Email:** support@signova.ai
**Phone:** Available for Business & Enterprise plans
**Response Time:** Usually within 2 hours

What specific help do you need?`;
                break;
                
            default:
                response = `I'm here to help! What specific question do you have about Signova?`;
        }
        
        this.addBotMessage(response);
    }
    
    openChatWidget() {
        if (this.isOpen) return;
        
        this.isOpen = true;
        this.chatWidget.style.transform = 'translateY(0) scale(1)';
        this.chatWidget.style.opacity = '1';
        
        // Focus input field
        setTimeout(() => {
            this.inputField.focus();
        }, 300);
        
        // Update status
        document.getElementById('chatbot-status').textContent = 'Online • Ready to help';
    }
    
    closeChatWidget() {
        if (!this.isOpen) return;
        
        this.isOpen = false;
        this.chatWidget.style.transform = 'translateY(100%) scale(0.8)';
        this.chatWidget.style.opacity = '0';
        
        // Update status
        document.getElementById('chatbot-status').textContent = 'Offline';
    }
    
    sendMessage() {
        const message = this.inputField.value.trim();
        if (!message) return;
        
        this.addUserMessage(message);
        this.inputField.value = '';
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Process message and respond
        setTimeout(() => {
            this.hideTypingIndicator();
            this.processMessage(message);
        }, 1000 + Math.random() * 2000); // Simulate processing time
    }
    
    addUserMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'chatbot-message user-message';
        messageElement.style.cssText = `
            align-self: flex-end;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 12px 16px;
            border-radius: 20px 20px 4px 20px;
            max-width: 80%;
            word-wrap: break-word;
            font-size: 0.9rem;
            line-height: 1.4;
            animation: slideInRight 0.3s ease;
        `;
        
        messageElement.textContent = message;
        this.messageContainer.appendChild(messageElement);
        this.scrollToBottom();
        
        this.messages.push({ type: 'user', content: message, timestamp: Date.now() });
    }
    
    addBotMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.className = 'chatbot-message bot-message';
        messageElement.style.cssText = `
            align-self: flex-start;
            background: rgba(248, 250, 252, 0.8);
            color: #1f2937;
            padding: 12px 16px;
            border-radius: 20px 20px 20px 4px;
            max-width: 85%;
            word-wrap: break-word;
            font-size: 0.9rem;
            line-height: 1.4;
            border: 1px solid rgba(0, 0, 0, 0.05);
            animation: slideInLeft 0.3s ease;
        `;
        
        // Handle markdown-like formatting
        const formattedMessage = message
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/✅/g, '<span style="color: #10b981;">✅</span>')
            .replace(/🔒|🤖|📞|🔧|⚙️|📊|🏢/g, '<span style="font-size: 1.1em;">$&</span>');
        
        messageElement.innerHTML = formattedMessage;
        this.messageContainer.appendChild(messageElement);
        this.scrollToBottom();
        
        this.messages.push({ type: 'bot', content: message, timestamp: Date.now() });
    }
    
    showTypingIndicator() {
        this.isTyping = true;
        const typingElement = document.createElement('div');
        typingElement.id = 'typing-indicator';
        typingElement.className = 'chatbot-message bot-message';
        typingElement.style.cssText = `
            align-self: flex-start;
            background: rgba(248, 250, 252, 0.8);
            color: #6b7280;
            padding: 12px 16px;
            border-radius: 20px 20px 20px 4px;
            max-width: 85%;
            font-size: 0.9rem;
            border: 1px solid rgba(0, 0, 0, 0.05);
            animation: slideInLeft 0.3s ease;
        `;
        
        typingElement.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <div style="display: flex; gap: 4px;">
                    <div style="width: 6px; height: 6px; background: #6b7280; border-radius: 50%; animation: typing 1.4s infinite ease-in-out;"></div>
                    <div style="width: 6px; height: 6px; background: #6b7280; border-radius: 50%; animation: typing 1.4s infinite ease-in-out 0.2s;"></div>
                    <div style="width: 6px; height: 6px; background: #6b7280; border-radius: 50%; animation: typing 1.4s infinite ease-in-out 0.4s;"></div>
                </div>
                <span>Signova Assistant is typing...</span>
            </div>
        `;
        
        // Add typing animation CSS
        if (!document.getElementById('typing-animation-css')) {
            const style = document.createElement('style');
            style.id = 'typing-animation-css';
            style.textContent = `
                @keyframes typing {
                    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
                    30% { transform: translateY(-10px); opacity: 1; }
                }
                
                @keyframes slideInLeft {
                    from { transform: translateX(-20px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes slideInRight {
                    from { transform: translateX(20px); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        this.messageContainer.appendChild(typingElement);
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        const typingElement = document.getElementById('typing-indicator');
        if (typingElement) {
            typingElement.remove();
        }
    }
    
    processMessage(message) {
        const response = this.generateResponse(message);
        this.addBotMessage(response);
    }
    
    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Pricing related
        if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('plan')) {
            return `Our pricing is designed to scale with your needs:

**Professional ($29/month)** - Perfect for small teams
**Business ($79/month)** - Great for growing companies  
**Enterprise ($199/month)** - Built for large organizations

All plans include a 14-day free trial. Which plan would work best for your team size?`;
        }
        
        // Features related
        if (lowerMessage.includes('feature') || lowerMessage.includes('what can') || lowerMessage.includes('capabilities')) {
            return `Signova offers powerful AI-driven document intelligence:

🤖 **AI Document Generation** - Create documents from prompts
📊 **Smart Analytics** - Track performance and insights  
🔒 **Enterprise Security** - SOC 2 compliant with encryption
⚙️ **Workflow Automation** - Streamline your processes
👥 **Team Collaboration** - Work together seamlessly
🔗 **API Integration** - Connect with your existing tools

What specific feature interests you most?`;
        }
        
        // Support related
        if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('problem')) {
            return `I'm here to help! 🤝 

For immediate assistance, I can help with:
• Account setup and registration
• Plan selection and upgrades  
• Feature explanations and demos
• Technical troubleshooting
• Billing and payment questions

For complex technical issues, I can connect you with our engineering team. What specific help do you need?`;
        }
        
        // Registration related
        if (lowerMessage.includes('register') || lowerMessage.includes('sign up') || lowerMessage.includes('account')) {
            return `Getting started is easy! Here's how to register:

1. **Choose Your Plan** - Start with our free trial
2. **Enter Your Details** - Work email and company info
3. **Add Payment Method** - Required for trial (no charge for 14 days)
4. **Verify Email** - Check your inbox for confirmation
5. **Start Creating** - Begin using AI document generation

Need help with any of these steps?`;
        }
        
        // General greeting
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return `Hello! 👋 Great to meet you! I'm here to help you get the most out of Signova.

Whether you're looking to:
• Learn about our AI features
• Choose the right plan
• Get started with registration
• Troubleshoot an issue

Just let me know what you need!`;
        }
        
        // Default response
        return `Thanks for your message! I want to make sure I give you the most helpful answer.

Could you tell me more about:
• What specific aspect of Signova you're interested in?
• What you're trying to accomplish?
• Any particular challenges you're facing?

I'm here to help with anything related to our platform! 😊`;
    }
    
    scrollToBottom() {
        setTimeout(() => {
            this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
        }, 100);
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.signovaChatbot = new SignovaChatbot();
});

// Make openSupportChat globally available
window.openSupportChat = function() {
    if (window.signovaChatbot) {
        window.signovaChatbot.openChatWidget();
    }
};

