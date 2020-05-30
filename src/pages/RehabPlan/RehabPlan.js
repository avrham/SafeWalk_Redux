import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { connect } from 'react-redux';
import { action } from './actions';

const mapStateToProps = state => ({
    x: state.rehabPlan.x
});

export class RehabPlan extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        // this.props.navigation.navigate('Home')
        return (
            <View style={styles.app_background}>
                <LinearGradient colors={['#8A817C', '#F4F3EE']} style={styles.gradient}>

                </LinearGradient>
            </View >
        );
    }
}

const styles = StyleSheet.create({
    app_background: {
        flex: 1
    },
    gradient: {
        flex: 1
    }
});

export default connect(
    mapStateToProps,
    { action }
)(RehabPlan);