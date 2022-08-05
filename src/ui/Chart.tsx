import React, {useState} from 'react';
import {View, Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {LineChartData} from 'react-native-chart-kit/dist/line-chart/LineChart';
import {Rect, Text as TextSVG, Svg} from 'react-native-svg';

export const Charts = (data: LineChartData) => {
  let [tooltipPos, setTooltipPos] = useState({
    x: 0,
    y: 0,
    visible: false,
    value: 0,
  });

  return (
    <View>
      <LineChart
        data={data}
        width={Dimensions.get('window').width}
        height={200}
        yAxisInterval={1}
        withVerticalLines={false}
        chartConfig={{
          backgroundColor: 'white',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(53, 68, 207, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 0,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '0',
            fill: 'rgba(121, 132, 237, 1)',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 6,
        }}
        decorator={() => {
          return tooltipPos.visible ? (
            <View>
              <Svg>
                <Rect
                  x={tooltipPos.x - 25}
                  y={tooltipPos.y + 10}
                  width="60"
                  height="30"
                  rx={7}
                  fill="rgba(121, 132, 237, 0.8)"
                />
                <TextSVG
                  x={tooltipPos.x + 5}
                  y={tooltipPos.y + 30}
                  fill="white"
                  fontSize="16"
                  fontWeight="bold"
                  textAnchor="middle">
                  {tooltipPos.value}
                </TextSVG>
              </Svg>
            </View>
          ) : null;
        }}
        onDataPointClick={d => {
          let isSamePoint = tooltipPos.x === d.x && tooltipPos.y === d.y;

          isSamePoint
            ? setTooltipPos(previousState => {
                return {
                  ...previousState,
                  value: d.value,
                  visible: !previousState.visible,
                };
              })
            : setTooltipPos({
                x: d.x,
                value: d.value,
                y: d.y,
                visible: false,
              });
        }}
      />
    </View>
  );
};

export default Charts;
