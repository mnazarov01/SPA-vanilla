import CityCreator from '../handlers/cityCreator';

const cityCreator = {

  render: () => `<form method="POST"><div id="wrapper_city_creator">
            <div class="loading_dots">
                <span class="dot"></span>
                    <div class="dots">    
                        <span></span>
                        <span></span>
                        <span></span>    
                </div> 
            </div>
            <div id="city_creator">
                <div class="modal_left">                
                    <span class="header">Новый город</span>
                    <div class="input-city-create">
                        <input class="input__field-city" type="text" id="input_city_create-name">
                        <span class="input__label-content-city">город</span>
                    </div> 
                    <div class="input-city-create">                    
                        <input class="input__field-city" type="text" id="input_city_create-country">
                        <span class="input__label-content-city">страна</span>
                    </div> 
                    <div class="input-city_footer">
                        <input class="input_city-button" type="submit" value="Добавить">
                    </div>
                </div>
                <div class="modal_right"><div class="image"></div></div>  
                <div class="city_creator-close"></div>
            </div>  
        </div></form>`,

  afterRender: () => {
    const creator = new CityCreator();
    creator.openWithNewValue('', false, false);
  },
};

export default cityCreator;
