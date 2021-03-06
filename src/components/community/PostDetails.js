import React, {Component} from 'react'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'
import { compose } from 'redux'
import { Link } from 'react-router-dom'
import moment from 'moment'
import './community.css'
import { EditorState, convertFromRaw} from 'draft-js';
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html';
import draftToMarkdown from 'draftjs-to-markdown';
import PostCommentTest from './PostCommentTest'
import CommentRegister from './CommentRegister'
import Preloader from '../functionalComponents/Preloader';
import { postDelete } from '../../store/actions/postAction'

class PostDetails extends Component {
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.postDelete(this.props.match.params.id, this.props.history);
	}
	render(){
		const { post, auth } = this.props;
		//auth.email
		const post_id = this.props.match.params.id;
		if(post) {
			const contentState = convertFromRaw(this.props.post.content);
			const editorState = EditorState.createWithContent(contentState);
			return(
				<div className="container section post-details">
					<div className="card z-depth-0">
						<div className="card-image">
							<img src={post.post_img} alt=""/>
						</div>
						<div className="card-content">
							<span className="card-title"><h3>{post.title}</h3></span>
							<Editor editorState= {editorState} toolbarHidden readOnly={true}/>
						</div>
						<div className="card-action grey-text">
							<div>Posted by {post.author}</div>
							<div>{moment(post.createAt.toDate()).calendar()}</div>
						</div>
					</div>
					<div className="postComment">
						<ul className="collection">
							<PostCommentTest post_id = {post_id} comment = {post.comments.length > 0 ? post.comments.map((item) => item) : post.comments }/>
							<CommentRegister postID = {this.props.match.params.id} />
						</ul>
					</div>
					{ (auth.uid === post.authorId) && /* 작성자에게만 수정/삭제 버튼이 생성됨. */
						<div className="revise-delete right">
							{/* <Link to= {{
								pathname: '/community/'+`${post.category}`+'/createPost',
								post_id: `${this.props.match.params.id}`,
								title: `${post.title}`,
								content: `${post.content}`,
								post_img:`${post.post_img}`,
								check_update: true,
							}}>
							<button className="btn">수정</button>
							</Link> */}
							<form onSubmit = {this.handleSubmit}>
								<div className="inputfield">
									<button className="btn myomColor-background">삭제</button>
								</div>
							</form>
						</div>
					}
				</div>
			)
		} else{
			return (
				<div className="container center">
					<p>게시글 로딩중...</p>
				</div>
			)
		}
	}
}

const mapStateToProps = (state, ownProps) => {
	const id = ownProps.match.params.id;
	const posts = state.firestore.data.posts;
	const post = posts? posts[id] : null
	return {
		post: post,
		auth: state.firebase.auth
	}
}

const mapDispatchToProps = (dispatch) => {
	return{
		postDelete: (docID, history) => dispatch(postDelete(docID, history)),
	}
}

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
		firestoreConnect((props) => {
			return [
				{ collection: 'posts', doc: props.match.params.id}
			]
		}),
)(PostDetails);