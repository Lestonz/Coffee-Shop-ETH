import React from "react";
import { View,
         Text,
         TouchableOpacity,   
 } from "react-native";

 import { COLORS, icons, FONTS, SIZES } from "../constants"

 const VerticalTextButton =({ containerStyle, label, selected, onPress}) =>{
     return (
        <TouchableOpacity
            style={{
                alignItems: 'center',
                transform: [{ rotate: '-90deg'}],
                ...containerStyle
            }}
            onPress={onPress}
        >
            <Text
                style={{
                    color: selected ? COLORS.white : COLORS.lightGreen,
                    ...FONTS.body3, fontSize: 20
                }}
            >
                {label}
            </Text>
        </TouchableOpacity>
     )
 }

 export default VerticalTextButton