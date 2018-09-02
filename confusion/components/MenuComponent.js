import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { Tile } from 'react-native-elements';
// import { DISHES } from '../shared/dishes';

import { connect  } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';


const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        // promotions: state.promotions,
        // leaders: state.leaders
    }
}

class Menu extends Component {

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         dishes: DISHES
    //     };
    // }

    static navigationOptions = {
        title: 'Menu'
    };

   

    render() {

        const { navigate } = this.props.navigation;

        const renderMenuItem = ({ item, index }) => {

            return (
                <Tile
                    key={index}
                    title={item.name}
                    caption={item.description}
                    // hideChevron={true}
                    featured
                    onPress={() => navigate('Dishdetail',{dishId: item.id})}
                    imageSrc={{ uri: baseUrl + item.image}}
                />
            );
        };


        return (
            <FlatList
                data={this.props.dishes.dishes}
                renderItem={renderMenuItem}
                keyExtractor={item => item.id.toString()}
            />
        );

    }

}


export default connect(mapStateToProps)(Menu);