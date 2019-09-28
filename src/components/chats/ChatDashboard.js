import React, { Component } from 'react'
import ChatSideNav from './ChatSideNav'
import M from 'materialize-css'
import {Link} from 'react-router-dom'
import { connect } from 'react-redux'
import { firestoreConnect, isLoaded } from 'react-redux-firebase'
import { compose } from 'redux'
import Preloader from '../functionalComponents/Preloader';
import ChatViews from './ChatViews'
import ChatTextBox from './ChatTextBox'
import ChatRoomList from './ChatRoomList'
import './chatDashboard.css'


class ChatDashboard extends Component {
	state = {
		selectedChat: null,
		selectedType: null,
		chatId: '',
		newChatFormVisible: false,
		email: null,
	}
	
	newChatBtnClicked = () => {
		this.setState({
			newChatFormVisible: true,
			selectChat: null,
		})
	}
	
	selectChat = (chatIndex, chatType, chatId) => {
		this.setState({
			selectedChat: chatIndex,
			selectedType: chatType,
			chatId: chatId,
		})
	}

	selectUnreadMessage = () => {
		this.setState({
			recevierHasRead : true
		})
	}

	// clickedChatWhereNotSender = (chatIndex) => {
	// 	this.state.chats[chatIndex].messages[this.state.chats[chatIndex].messages.length -1].sender !== this.state.email;
	// }

	componentDidMount(){
		M.AutoInit();
	}
	render(){
		const { chats, profile, match, chatInDeal } = this.props;
		const { selectedChat, selectedType, chatId } = this.state;
		const dealingChat = !isLoaded(chats) ? null : chats.filter(chat => chat.deal === true);
		return(
			<div className="chatDashboard">
				<div className="chatsTemplate container">
					<div className="chatMessages">
						{	
							!isLoaded(chats)
								? <Preloader /> 
								:
								(this.state.selectedType == 'dealChats') ? 
									<ChatViews profile = { profile } chat = {dealingChat[this.state.selectedChat]} />
									:
									<ChatViews profile = { profile } chat = {chats[this.state.selectedChat]} />
						}
					</div>
					{
						this.state.selectedChat !== null && !this.state.newChatFormVisible && isLoaded(chatId)
						? <ChatTextBox profile={profile} chatId={this.state.chatId}></ChatTextBox> :
						null
					}
					<ul className="tabs">
						<li className="tab"><a href="#allChat">전체 메시지</a></li>
						<li className="tab"><a href="#dealChat">거래 중 메시지</a></li>
					</ul>
					<ChatRoomList profile={profile} chats={chats} chatInDeal = {dealingChat} newChatBtnFn = {this.newChatBtnClicked} selectChatFn = {this.selectChat} selectedChatIndex = {this.state.selectedChat} selectUnreadMessage = {this.state.selectUnreadMessage}/>
				</div>
			</div>

		)
	}
}

const mapStateToProps = (state) => {
	return{
		chats: state.firestore.ordered.chatAll,
		profile: state.firebase.profile,
	}
}

export default compose(
	connect(mapStateToProps),
	firestoreConnect((props) => {
		const _usr = !isLoaded(props.profile.email) ? 'null' : props.profile.email;
		return [
				{ collection: 'chats' , where: ['users', 'array-contains', _usr] ,storeAs:'chatAll'},
		]
	}),
)(ChatDashboard);