import firebase from 'firebase/app';

export const createService = (serviceData) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const userAuth = getState().firebase.auth;
    const docRef = firestore.collection('testService').doc();
    const storageRef = firebase.storage().ref('images/testService/' + docRef.id);
    let batch = firestore.batch();
    let basic_chips = serviceData.basic_chips ? serviceData.basic_chips : [];
    let pro_chips = serviceData.pro_chips ? serviceData.pro_chips : [];
    let videos = [];
    let fileArray = []
    serviceData.images.forEach(item => Object.values(item).forEach(file => {
      if(file instanceof File) fileArray = [...fileArray, file];
    }));
    serviceData.videos.forEach(item => Object.values(item).forEach(file => {
      if(file instanceof File) fileArray = [...fileArray, file];
    }));

    const putStoageItem = (item, index) => {
      let type = item.type;
      let name;
      if(type.split('/').shift() === 'image') {
        if(index === 0) name = 'thumbnail';
        else name = 'details' + index;
      } else name = 'video' + index;

      return storageRef.child(name).put(item)
      // .on('state_changed', snapshot => {
      //   let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      //   console.log(progress);
      // })
      .then((snapshot) => { return snapshot.ref.getDownloadURL() })
      .then((url) => { 
        console.log('one success!')
        if(type.split('/').shift() === 'image') {
          batch.set(docRef, { images: 
            {
              [name]: url,
            }
          }, {merge: true});
        } else {
          videos.push(url);
        }
      })
      .catch((err) => console.log('one failed', err.message))
    }

    Promise.all(fileArray.map(async (item, index) => {
      await putStoageItem(item, index);
    }))
    .then(() => {
      if(serviceData.priority2) {
        batch.set(docRef, {
          [serviceData.priority2]: 3,
        }, {merge: true})
      }
      if(serviceData.priority3) {
        batch.set(docRef, {
          [serviceData.priority3]: 1,
        }, {merge: true})
      }
      
      batch.set(docRef, {
        [serviceData.priority1]: 5,
        price: [
          {
            type: 'BASIC',
            price: serviceData.basic_price,
            intro: serviceData.basic_intro,
            working: serviceData.basic_working,
            modify: serviceData.basic_modify,
            chips: ['자막', '음악', '컷편집', ...basic_chips],
          },
          {
            type: 'PRO',
            price: serviceData.pro_price,
            intro: serviceData.pro_intro,
            working: serviceData.pro_working,
            modify: serviceData.pro_modify,
            chips: ['자막', '음악', '컷편집', '기본 색보정', ...pro_chips],
          }
        ],     
        service_title: serviceData.service_title,
        service_content: serviceData.service_content,
        videos: videos,
        provider_id: userAuth.uid,
        timestamp: new Date(),
        reviewCount: 0,
      }, {merge: true});

      batch.commit();
      console.log('All uploaded!');
    }).catch((err) => {
      console.log('failed', err.message);
    })
  }
}

export const serviceRegister = (serviceData, history) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const userAuth = getState().firebase.auth;
    let docRef = firestore.collection('services').doc();
    let storageRef = firebase.storage().ref('images/services/' + docRef.id).child(serviceData.service_img.name);
    storageRef.put(serviceData.service_img)
      .then(() => {
        storageRef.getDownloadURL()
          .then((url) => {
            // services collection's document
            docRef.set({
              serviceProvider: userAuth.uid,
              category: serviceData.service_type,
              description: [
                { title: '서비스 설명', contents: serviceData.service_desc},
                { title: '작업 과정', contents: serviceData.service_process},
                { title: '작업 방식', contents: serviceData.service_doing},
                { title: '작업 스타일', contents: serviceData.service_style},
              ],
              filter: null,
              imgURL: url,
              inquiryCount: 0,
              reviewCount: 0,
              prices: [
                { price: serviceData.service_price_standard, contents: serviceData.standard_desc },
                { price: serviceData.service_price_deluxe, contents: serviceData.deluxe_desc },
                { price: serviceData.service_price_premium, contents: serviceData.premium_desc },
              ],
              timestamp: new Date(),
            });
            // services collections's sub-collection's document: reviews
            // docRef.collection('reviews').add({
            //   contents: '',
            //   profile: '',
            //   starts: '',
            //   timestamp: '',
            //   userID: '',
            //   uid: '',
            // });
            // services collections's sub-collection's document: inquiry
            // docRef.collection('inquiry').add({
            //   comment: null,
            //   contents: '',
            //   timestamp: '',
            //   userID: '',
            //   uid: '',
            // });
          });
      })
    .then(() => {
      dispatch({ type: 'REGISTER_SERVICE_SUCCESS', serviceData });
      history.push('/mypageProvider/myServices');
    }).catch((err) => {
      dispatch({ type: 'REGISTER_SERVICE_ERROR', err })
    })
  }
}

export const serviceDelete = (curInstance, id, password) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const user = firebase.auth().currentUser;
    const credentials = firebase.auth.EmailAuthProvider.credential(user.email, password);
    let key_for_subCollection = false;
    let docRef = firestore.collection('services').doc(id);
  
    user.reauthenticateWithCredential(credentials)
      .then(() => {
        return docRef.get().then((doc) => {
          if(doc.exists) {
            return docRef.collection('inquiry').get().then(sub => {    // if inquiry sub-collection exists
              if(sub.docs.length > 0) {    
                // console.log('inquiry exists!')        
                key_for_subCollection = true;
                // { code : 'inquiry/already-exist' }
              }
            })
            return docRef.collection('reviews').get().then(sub => {    // if reviews sub-collection exists
              if(sub.docs.length > 0) {        
                //console.log('reviews exists!')
                key_for_subCollection = true;        
                // throw new Error('reviews error!')
                // { code : 'reviews/already-exist' }
              }
            })
          }
        })
      })
      .then(() => {
        if(key_for_subCollection) throw { code : 'inquiry&reviews/already-exist' }
      })
      .then(() => {
        docRef.get().then((doc) => {
          const fromURL = doc.data().imgURL;
          const storageRef = firebase.storage().refFromURL(fromURL);

          storageRef.delete().then(() => {
            docRef.delete();
            curInstance.close();
          })
        })
      })
      .then(() => {
        dispatch({ type: 'DELETE_SERVICE_SUCCESS', })
        // history.push('/mypageProvider/myServices');
      })
      .catch((err) => {
        console.log(err.code);
        switch(err.code) {
          case "auth/wrong-password":
            console.log(err)
            dispatch({type: 'CHECK_PASSWORD_ERROR', err});
            break;
          
          case "auth/too-many-requests":
            console.log(err);
            dispatch({type: 'TOO_MANY_REQUESTS_FOR_VERIFICATION'});
            break;

          case 'inquiry&reviews/already-exist':
            console.log(err);
            dispatch({ type: 'DELETE_SERVICE_ERROR_WITH_INQUIRY&REVIEWS' });
            break;

          default:
            console.log(err)
            dispatch({ type: 'DELETE_SERVICE_ERROR' });
        }
    })   
  }
}

export const serviceUpdate = (serviceData, history) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    let docRef = firestore.collection('services').doc(serviceData.service_id);
    let storageRef = firebase.storage().ref('images/services/' + docRef.id);

    docRef.get().then((doc) => {
      const fromURL = doc.data().imgURL;
      const httpsRef = firebase.storage().refFromURL(fromURL);
      
      httpsRef.delete()
        .then(() => {
          storageRef.child(serviceData.service_img.name).put(serviceData.service_img)
          .then(() => {
            storageRef.child(serviceData.service_img.name).getDownloadURL()
              .then((url) => {
                docRef.update({
                  category: serviceData.service_type,
                  description: [
                    { title: '서비스 설명', contents: serviceData.service_desc},
                    { title: '작업 과정', contents: serviceData.service_process},
                    { title: '작업 방식', contents: serviceData.service_doing},
                    { title: '작업 스타일', contents: serviceData.service_style},
                  ],
                  imgURL: url,
                  prices: [
                    { price: serviceData.service_price_standard, contents: serviceData.standard_desc },
                    { price: serviceData.service_price_deluxe, contents: serviceData.deluxe_desc },
                    { price: serviceData.service_price_premium, contents: serviceData.premium_desc },
                  ],
                  updatedAt: new Date(),
                })
              })
          })
        }).then(()=> {
          dispatch({ type: 'UPDATE_SERVICE_SUCCESS', serviceData });
          history.push('/mypageProvider/myServices');
        }).catch((err) => {
          dispatch({ type: 'UPDATE_SERVICE_ERROR', err })
        })
    })
  }
}

export const inquiryRegister = (docID, inquiryData) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const userAuth = getState().firebase.auth;
    const docRef = firestore.collection('services').doc(docID);
    docRef.collection('inquiry').add({
      comment: [],
      contents: inquiryData.inquiry_contents,
      userID: userAuth.email,
      uid: userAuth.uid,
      timestamp: new Date()
    }).then(() => {
      docRef.get().then((doc) => {
        const inquiryCount = doc.data().inquiryCount;
        docRef.update({
          inquiryCount: inquiryCount + 1,
        })
      }).then(() => {
        dispatch({type: 'CREATE_INQUIRY_SUCCESS', inquiryData})
      })
    }).catch((err) => {
      dispatch({type: 'CREATE_INQUIRY_ERROR', err})
    })
  }
}

export const reviewsRegister = (docID, reviewsData) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const userAuth = getState().firebase.auth;
    const userProfile = getState().firebase.profile;
    const docRef = firestore.collection('services').doc(docID);
    docRef.collection('reviews').add({
      comment: [],
      stars: '',
      profile: userProfile,
      contents: reviewsData.reviews_contents,
      userID: userAuth.email,
      uid: userAuth.uid,
      timestamp: new Date(),
    }).then(() => {
      docRef.get().then((doc) => {
        const reviewCount = doc.data().reviewCount;
        docRef.update({
          reviewCount: reviewCount + 1,
        })
      }).then(() => {
        dispatch({type: 'CREATE_REVIEWS_SUCCESS', reviewsData})
      })
    }).catch((err) => {
      dispatch({type: 'CREATE_REVIEWS_ERROR', err})
    })
  }
}

export const _init_authError = (authError) => {
  return (dispatch) => {
    if(authError) dispatch({ type : 'INIT_AUTHERROR_SUCCESS'})
  }
}

export const _delete_inquiry = (service_id, inquiry_id) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const userAuth = getState();
    const docRef = firestore.collection('services').doc(service_id);
    const subRef = docRef.collection('inquiry').doc(inquiry_id);

    subRef.delete()
    .then(() => {
      return docRef.get().then((doc) => {
        const inquiryCount = doc.data().inquiryCount;
        docRef.update({
          inquiryCount: inquiryCount - 1,
        })
      })
    })
    .then(() => {
      dispatch({ type : 'DELETE_INQUIRY_SUCCESS' });
    })
    .catch((err) => {
      dispatch({ type : 'DELETE_INQUIRY_ERROR', err })
    })
  }
}
export const _delete_review = (service_id, review_id) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const userAuth = getState().firebase.auth;
    const docRef = firestore.collection('services').doc(service_id);
    const subRef = docRef.collection('reviews').doc(review_id);

    subRef.delete()
    .then(() => {
      return docRef.get().then((doc) => {
        const reviewCount = doc.data().reviewCount;
        docRef.update({
          reviewCount: reviewCount - 1,
        })
      })
    })
    .then(() => {
      dispatch({ type : 'DELETE_REIVEW_SUCCESS' });
    })
    .catch((err) => {
      dispatch({ type : 'DELETE_REIVEW_ERROR', err });
    })
  }
}
export const _update_inquiry = (service_id, inquiry_id, updating_data) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const userAuth = getState().firebase.auth;
    const docRef = firestore.collection('services').doc(service_id);
    const subRef = docRef.collection('inquiry').doc(inquiry_id);

    subRef.update({
      contents: updating_data,
    })
    .then(() => {
      dispatch({ type: 'UPDATE_INQUIRY_SUCCESS'})
    })
    .catch((err) => {
      dispatch({ type: 'UPDATE_INQUIRY_ERROR', err})
    })
  }
}

export const _update_review = (service_id, review_id, updating_data) => {
  return (dispatch, getState, { getFirestore }) => {
    const firestore = getFirestore();
    const userAuth = getState().firebase.auth;
    const docRef = firestore.collection('services').doc(service_id);
    const subRef = docRef.collection('reviews').doc(review_id);

    subRef.update({
      contents: updating_data,
    })
    .then(() => {
      dispatch({ type: 'UPDATE_REVIEW_SUCCESS' })
    })
    .catch((err) => {
      dispatch({ type: 'UPDATE_REVIEW_ERROR', err})
    })
  }
}

export const _report_badUser = () => {
  return (dispatch) => {
    dispatch({type: 'REPORT_BADUSER_SUCCESS'})
  }
}