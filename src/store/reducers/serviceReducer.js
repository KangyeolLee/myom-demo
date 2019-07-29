const initState = {
  themas: [
    { title : 'PARIS', src : 'img/theme/paris.jpg' },
    { title : 'KOREA', src : 'img/theme/korea.jpg' },
    { title : 'CHINA', src : 'img/theme/china.jpg' },
    { title : 'SPAIN', src : 'img/theme/spain.jpg' },
    { title : 'GERMANY', src : 'img/theme/germany.jpg' },
    { title : 'INDIA', src : 'img/theme/india.jpg' }
  ],
  bests: [
    { src : 'img/bestReviews/review_sample01.jpg', title : '베스트 후기1', content : 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, velit. Praesentium nesciunt similique, illo rem ullam dolorem maiores sint eaque fugiat ea. Ut nesciunt molestiae, quae nobis tenetur magnam incidunt.'},
    { src : 'img/bestReviews/review_sample02.jpg', title : '베스트 후기2', content : 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, velit. Praesentium nesciunt similique, illo rem ullam dolorem maiores sint eaque fugiat ea. Ut nesciunt molestiae, quae nobis tenetur magnam incidunt.'},
    { src : 'img/bestReviews/review_sample03.jpg', title : '베스트 후기3', content : 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatem, velit. Praesentium nesciunt similique, illo rem ullam dolorem maiores sint eaque fugiat ea. Ut nesciunt molestiae, quae nobis tenetur magnam incidunt.'}
  ],
  recommends: [
    {
      category : 'PARIS',
      contents : [
        { title : 'example01', src : 'img/' },
        { title : 'example02', src : 'img/' },
        { title : 'example03', src : 'img/' }
      ]
    }, 
    {
      category : 'KOREA',
      contents : [
        { title : 'example01', src : 'img/' },
        { title : 'example02', src : 'img/' },
        { title : 'example03', src : 'img/' }
      ]
    },
    {
      category : 'INDIA',
      contents : [
        { title : 'example01', src : 'img/' },
        { title : 'example02', src : 'img/' },
        { title : 'example03', src : 'img/' }
      ]
    },
    {
      category : 'GERMANY',
      contents : [
        { title : 'example01', src : 'img/' },
        { title : 'example02', src : 'img/' },
        { title : 'example03', src : 'img/' }
      ]
    },
    {
      category : 'CHINA',
      contents : [
        { title : 'example01', src : 'img/' },
        { title : 'example02', src : 'img/' },
        { title : 'example03', src : 'img/' }
      ]
    },
    {
      category : 'SPAIN',
      contents : [
        { title : 'example01', src : 'img/' },
        { title : 'example02', src : 'img/' },
        { title : 'example03', src : 'img/' }
      ]
    }
  ]
}

const serviceRuducer = (state=initState, action) => {
  switch(action.type) {
    default:
      return state;
  }
}

export default serviceRuducer;