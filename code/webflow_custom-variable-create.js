
createColorVariable: async () => {
      // Get Collection
      const collection = await webflow.getDefaultVariableCollection()

      // Create Color Variable with a HEX Codre
      const myColorVariable = await collection?.createColorVariable(
        'Base VarColor1',
        '#5E688D',
      )
      console.log(myColorVariable)
    }


createCustomColorVariable: async () => {
      // Get Collection
      const collection = await webflow.getDefaultVariableCollection()

      // Create Color Variable
      const webflowColor = await collection?.createColorVariable(
        'Base VarColor1',
        '#5E688D',
      )

      // Get the binding to the webflowColor variable
      const webflowColorBinding = await webflowColor?.getBinding()

      // Function to create a string that uses the binding and CSS color-mix function
      const colorMix = (binding, color, opacity) =>
        `color-mix(in srgb, ${binding} , ${color} ${opacity}%)`

      // Create a color variable that uses a CSS function
      const webflowColorShade = await collection?.createColorVariable('VarColor1 L100', {
        type: 'custom',
        value: colorMix(webflowColorBinding, '#fff', 90),
      })
      console.log(webflowColorShade)
    }



createCustomColorVariable: async () => {
      // Get Collection
      const collection = await webflow.getDefaultVariableCollection()

      // Create Color Variable
      const webflowBlue = await collection?.createColorVariable(
        'blue-500',
        '#146EF5',
      )

      // Get the binding to the webflowBlue variable
      const webflowBlueBinding = await webflowBlue?.getBinding()

      // Function to create a string that uses the binding and CSS color-mix function
      const colorMix = (binding, color, opacity) =>
        `color-mix(in srgb, ${binding} , ${color} ${opacity}%)`

      // Create a color variable that uses a CSS function
      const webflowBlue400 = await collection?.createColorVariable('blue-400', {
        type: 'custom',
        value: colorMix(webflowBlueBinding, '#fff', 60),
      })
      console.log(webflowBlue400)
    }