import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native'
/**
 * 弹出层
 */
const { width: windowWidth, height: windowHeight } = Dimensions.get('window')

type PopUpStyle = {
  width: number,
  [propName: string]: any
}

export type PopUpProps = {
  maskClosable?: boolean,
  style?: PopUpStyle,
  duration: number,
  onClose(): void,
  onCloseTransitionEnd?(): void,
  top: number
  slideDistance: number,
  visible: boolean
}

export type PopUpState = {
  offset: Animated.Value,
  isClosed: boolean
}

export default class PopUp extends Component<PopUpProps, PopUpState> {
  static defaultProps = {
    top: 100,
    slideDistance: 50
  }

  constructor(props: PopUpProps) {
    super(props)
    this.state = {
      offset: new Animated.Value(0),
      isClosed: true
    }
  }

  componentDidUpdate(prevProps: PopUpProps, prevState: PopUpState){
    let fadeIn = this.props.visible && !prevProps.visible;
    let fadeOut = !this.props.visible && prevProps.visible;
    if(fadeIn){
      this.in()
    }else if(fadeOut){
      this.out();
    }
  }

  in = () => {
    this.setState({
      offset: new Animated.Value(0),
      isClosed: false
    }, () => {
      Animated.timing(
        this.state.offset,
        {
          easing: Easing.ease,
          duration: this.props.duration,
          toValue: 1,
          useNativeDriver: true
        }
      ).start()
    })
  }

  out = () => {
    Animated.timing(
      this.state.offset,
      {
        easing: Easing.ease,
        duration: this.props.duration,
        toValue: 0,
        useNativeDriver: true
      }
    ).start(() => {
      this.setState({
        isClosed: true
      })
      this.props.onCloseTransitionEnd && this.props.onCloseTransitionEnd()
    })
  }

  render() {
    let { maskClosable, style } = this.props
    if(!this.state.isClosed){
      return (
        <Animated.View style={[styles.container, { opacity: this.state.offset}]}>
          <TouchableOpacity 
            style={{ flex: 1 }} 
            onPress={maskClosable ? this.props.onClose : undefined}>
          </TouchableOpacity>
          <Animated.View
            style={[{
              position: 'absolute',
              top: 0, 
              marginLeft: style && style.width ? (windowWidth - style.width) / 2 : 0,
              transform: [{
                translateY: this.state.offset.interpolate({
                  inputRange: [0, 1],
                  outputRange: [this.props.top + this.props.slideDistance, this.props.top]
                }),
              }]
            }, style]}>
            {this.props.children}
          </Animated.View>
        </Animated.View>
      )
    }else{
      return null;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    width: windowWidth,
    height: windowHeight,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.6)',
    top: 0,
    zIndex: 9
  }
})
