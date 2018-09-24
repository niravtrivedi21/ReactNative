import React, { Component } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, Button, Modal, Alert, PanResponder, Share } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
// import { DISHES } from '../shared/dishes';
// import { COMMENTS } from '../shared/comments';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';

import { postFavorite, postComments } from '../redux/ActionCreators';

import * as Animatable from 'react-native-animatable';




const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites,
        //   showModal: false

    }
}


const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComments: (dishId, rating, author, comment) => dispatch(postComments(dishId, rating, author, comment)),
});

function RenderDish(props) {
    const dish = props.dish;

    handelViewRef = ref => this.view = ref; 

    const recognnizeDrag = ({ moveX, moveY, dx, dy }) => {
        if (dx < -200)
            return true;
        else
            return false;
    }

    const recognizeComment = ({ moveX, moveY, dx, dy }) => {
        if (dx > 200)
            return true;
        else
            return false;
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },

        onPanResponderGrant: () => {
            this.view.rubberBand(1000)
            .then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));
        },

        onPanResponderEnd: (e, gestureState) => {
            if (recognnizeDrag(gestureState)){
                Alert.alert(
                    'Add to Favorites?',
                    'Are you sure you wish to add ' + dish.name + ' to your favorites?',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Cancel pressed'),
                            style: 'cancel'
                        },
                        {
                            text: 'OK',
                            onPress: () => props.favorite ? console.log('Already favorite') : props.onPress('fav'),
                        }
                    ],
                    { cancelable: false }

                )

                return true;
            }
               
            if (recognizeComment(gestureState)){
                props.onPress('com');
            }
                
        }

    });

    const shareDish = (title, message, url) => {

        Share.share({
            title: title,
            message: title + ': ' + message + ' ' + url,
            url: url
        },{
            dialogTitle: 'Share ' + title
        });

    }

    if (dish != null) {
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
            ref={this.handelViewRef}
            {...panResponder.panHandlers}>

                <Card
                    featuredTitle={dish.name}
                    image={{ uri: baseUrl + dish.image }}>

                    <Text style={{ margin: 10 }}>
                        {dish.description}
                    </Text>
                    <View style={styles.formRow}>
                        <Icon
                            raised
                            reverse
                            name={props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPress('fav')}
                        />
                        <Icon
                            raised
                            reverse
                            name='pencil'
                            type='font-awesome'
                            color='#512DA8'
                            onPress={() => props.onPress('com')}
                        />

                        <Icon
                            raised
                            reverse
                            name='share'
                            type='font-awesome'
                            color='#51D2A8'
                            onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)}
                        />


                    </View>

                </Card>
            </Animatable.View>
        );
    }
    else {
        return (<View></View>);
    }
}

function RenderComments(props) {
    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {


        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>
                    {item.comment}
                </Text>
                <Rating
                    type="star"
                    fractions={1}
                    startingValue={item.rating}
                    imageSize={12}
                    onFinishRating={this.ratingCompleted}
                    style={{ alignItems: 'flex-start', paddingVertical: 1 }}
                />
                <Text style={{ fontSize: 12 }}>
                    {'--' + item.author + ', ' + item.date}
                </Text>
            </View>
        )
    }

    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>

            <Card title="Comments">
                <FlatList data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()} />
            </Card>
        </Animatable.View>
    );
}

class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // dishes: DISHES,
            // comments: COMMENTS,
            // favorites:[]
            showModal: false,
            rating: 5,
            author: '',
            comment: '',
            dishId: ''
        };
    };

    toggaleModal() {
        this.setState({ showModal: !this.state.showModal });

    }


    handelSubmit() {
        console.log('Submit-------');
        // this.props.postComments(this.state.dishId, this.state.rating, this.state.author, this.state.comment);
        // this.setState({ showModal: !this.state.showModal });
        // this.resetForm();


    }

    resetForm() {
        this.setState({
            author: '',
            comment: '',
        });
    }

    handelComment(dishId) {
        this.toggaleModal();
        this.setState({ dishId: dishId });
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');
        return (
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={(value) => {
                        if (value === 'fav') {
                            this.markFavorite(dishId);
                        }
                        else if(value === 'com') {
                            this.handelComment(dishId);
                        }
                    }} />
                <RenderComments comments={this.props.comments.comments.filter((el) => el.dishId === dishId)} />
                <Modal
                    animationType={'slide'}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => { this.toggaleModal(); this.resetForm() }}
                    onRequestClose={() => { this.toggaleModal(); this.resetForm() }}
                >
                    <View style={styles.modal}>
                        <Rating
                            showRating
                            type="star"
                            fractions={1}
                            startingValue={this.state.rating}
                            imageSize={40}
                            onFinishRating={(value) => { this.setState({ rating: value }) }}
                            style={{ paddingVertical: 10 }}
                        />
                        <Input
                            placeholder='Author'
                            leftIcon={
                                <Icon
                                    name='user'
                                    size={24}
                                    color='black'
                                    type='simple-line-icon'

                                />
                            }
                            onChangeText={(text) => {
                                this.setState({ author: text })
                            }}
                            value={this.state.author}
                            shake={true}
                        />
                        <Input
                            placeholder='Comment'
                            leftIcon={
                                <Icon
                                    name='bubble'
                                    size={22}
                                    color='black'
                                    type='simple-line-icon'
                                />
                            }
                            style={{ margin: 10 }}
                            onChangeText={(text) => {
                                this.setState({ comment: text })
                            }}
                            value={this.state.comment}
                        />
                        <View style={styles.buttonContainer}>
                            <Button
                                onPress={() => 
                                    this.handelSubmit()}

                                style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}
                                color='#512DA8'
                                title='SUBMIT'
                            />
                        </View>

                        <View style={styles.buttonContainer}>
                            <Button
                                onPress={() => { this.toggaleModal(); this.resetForm() }}
                                style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}
                                color='#808080'
                                title='CANCLE'
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    formRow: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },

    modal: {
        justifyContent: 'center',
        margin: 20
    },

    buttonContainer: {
        margin: 10
    },

})

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);