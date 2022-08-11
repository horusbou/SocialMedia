import './message.css'
import {PageTitle} from "../compontents"

export default function MessagesPage(){
    return <div className="main message" style={{width:'76%'}} >
        <PageTitle title="Messages" />
        <div className="messages-content">
            <div className="users">
            user1
            </div>
            <div className="message-body">
                <div className="message-container">
                    <h3>Select a message</h3>
                    <p>Choose from your existing conversations, start a new one, or just keep swimming.</p>
                </div>
            </div>
        </div>
    </div>
}
