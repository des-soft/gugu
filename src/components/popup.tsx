import React, { Component } from 'react'
import { StyleSheet, View, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native'

/**
 * 弹出层
 */
const { width, height } = Dimensions.get('window')

export type PopUpProps = {
  transparentIsClick?: boolean,
  modalBoxBg: string,
  modalBoxHeight: number,
  modalBoxWidth: number,
  modalBoxRadius: number,
  duration: number,
  onClose?: Function
  onCloseTransitionEnd?: Function
  top?: number
  offsetTop?: number,
}

export type PopUpState = {
  offset: Animated.Value,
  show: boolean,
}

export default class PopUp extends Component<PopUpProps, PopUpState> {
  defaultTop: number = 100;
  defaultOffsetTop: number = 50;
  constructor(props: PopUpProps) {
    super(props)
    this.state = {
      offset: new Animated.Value(0),
      show: false
    }
  }

  in() {
    this.setState({
      offset: new Animated.Value(0)
    }, () => {
      Animated.timing(
        this.state.offset,
        {
          easing: Easing.ease,
          duration: this.props.duration,
          toValue: 1
        }
      ).start()
    })
  }

  out() {
    Animated.timing(
      this.state.offset,
      {
        easing: Easing.ease,
        duration: this.props.duration,
        toValue: 0
      }
    ).start()

    setTimeout(
      () => {
        this.setState({ show: false });
        this.props.onCloseTransitionEnd && this.props.onCloseTransitionEnd()
      },
      this.props.duration
    )
  }

  show() {
    this.setState({
      show: true
    }, this.in.bind(this))
  }

  hide() {
    this.props.onClose && this.props.onClose()
    this.out()
  }

  render() {
    let { transparentIsClick, modalBoxBg, modalBoxHeight, modalBoxWidth, modalBoxRadius } = this.props
    let opacity = this.state.offset.interpolate({
      inputRange: [0, 1],
      outputRange: [0,1]
    })
    if (this.state.show) {
      return (
        <Animated.View style={[styles.container, { height: height , opacity}]}>
          <TouchableOpacity style={{
            height: height, width
          }} onPress={transparentIsClick ? this.hide.bind(this) : undefined}>
          </TouchableOpacity>
          <Animated.View
            style={[styles.modalBox, {
              height: modalBoxHeight, top: 0, backgroundColor: modalBoxBg,
              width: modalBoxWidth,
              marginLeft: (width - modalBoxWidth) / 2,
              borderRadius: modalBoxRadius,
              transform: [{
                translateY: this.state.offset.interpolate({
                  inputRange: [0, 1],
                  outputRange: [(this.props.top || this.defaultTop) + (this.props.offsetTop || this.defaultOffsetTop), this.props.top || this.defaultTop]
                }),
              }]
            }]}>
            {this.props.children}
          </Animated.View>
        </Animated.View>
      )
    }
    return <View />
  }
}

const styles = StyleSheet.create({
  container: {
    width: width,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.6)',
    top: 0,
    zIndex: 9
  },
  modalBox: {
    position: 'absolute',
    width: width
  }
})
