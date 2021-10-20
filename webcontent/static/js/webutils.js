/**
 * (c) 2016 exaTech Ingenieria SpA.
 *
 * Libreria de utilidades para aplicaciones WEB.
 */

/*******************************************************************************
 * CONSTANTES GENERALES
 ******************************************************************************/

/** Strings comunes para formateo de fecha/hora */
var DATEFORMAT = {
  // Formats for moment.js
  SHORT_DATETIME: "DD-MM-YYYY HH:mm:ss",
  SHORT_DATETIME_MINUTES: "DD-MM-YYYY HH:mm",
  SHORT_DATE: "DD-MM-YYYY",
  SHORT_TIME: "H:mm:ss",
  SHORT_TIME_MINUTES: "H:mm",
  SHORT_DATE_WS: "YYYY-MM-DD", // Formato de serializacion de fecha para Web Services. NO CAMBIAR.
  SHORT_DATETIME_WS: "YYYY-MM-DDTHH:mm:ss",

  LONG_DATETIME: "LLLL",
  LONG_DATE: "dddd D [de] MMMM [de] YYYY",

  // Formats for the date picker
  PICKER_SHORT_DATE: "dd-mm-yyyy"
};


/** Expresion regular para evaluacion de email. */
var REGEX_EMAIL = /^[a-zA-Z0-9.!#$%&*+_{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


/*******************************************************************************
 * UTILITARIOS
 ******************************************************************************/

(function (window) {
  'use strict';

  function _XT_Utils_Initializer() {
    var _Utils = {};


    /**
     * Toggles visibility of components matched by selector using slide effect.
     * @param selector
     */
    _Utils.slideToggleVisibility = function (selector) {
      $(selector).slideToggle(100);
    };

    /**
     * Toggles visibility of components matched by selector.
     * @param selector jquery selector to toggle visibility to.
     * @param duration (optional) duration of the toggle animation. default 100.
     */
    _Utils.toggleVisibility = function (selector, duration) {
      $(selector).toggle(_Utils.isNumber(duration) ? duration : 100);
    };


    /**
     * Sets the visibility of a jquery Element.
     * @param selector
     */
    _Utils.setVisibility = function (selector, visible) {
      var elem = $(selector);
      var elementVisible = elem.is(":visible");
      var visibility = _Utils.isBool(visible) ? visible : false;

      if(visibility && !elementVisible) {
        elem.show();
      }
      else if (!visibility && elementVisible) {
        elem.hide();
      }
    };


    /**
     * Scrolls the viewport to the element defined by selector.
     */
    _Utils.scrollToElement = function (selector, delay) {
      var scrtime = Utils.isNumber(delay) ? delay : 400;
      $('html, body').animate({
        scrollTop: $(selector).offset().top
      }, scrtime);
    };


    /**
     * Remueve todos los caracteres no alfanumericos de un string.
     * @param value String a procesar.
     * @return {string} Solo con caracteres alfanumericos.
     */
    _Utils.formatAlphanumeric = function (value) {
      return value.replace(/[^0-9a-zA-Z]/g, "").trim();
    };


    /**
     * Filtra los elementos option dentro de un select, segun el valor entregado.
     * <p>
     * Los elementos a filtrar deben tener definido el atributo "data-filter" el cual
     * se utilizara para definir los elementos a ocultar/mostrar.
     * <p>
     * Adicionalmente, si el select tiene un elemento option con el atributo "data-filter-emptyvalue",
     * este sera filtrado y mostrado solo cuando la aplicacion el filtro no tiene resultados.
     *
     * @param {JQuery} selectObject representante del select a filtrar.
     * @param filterValue Valor del atributo data-filter a filtrar.
     * @param autoSelect Si es true, se selecciona el elemento visible con atributo selected automaticamente,
     *        o el primero visible si no hay ninguno con atributo selected.
     */
    _Utils.filterCombobox = function (selectObject, filterValue, autoSelect) {

      var fullData = selectObject.data("filterdata-values");
      var emptyValue = selectObject.data("filterdata-emptyvalue");

      // Initialize if first time.
      if (!fullData) {
        fullData = selectObject.find("option[data-filter]").detach();
        selectObject.data("filterdata-values", fullData);
        emptyValue = selectObject.find("option[data-filter-emptyvalue]").detach();
        selectObject.data("filterdata-emptyvalue", emptyValue);
        selectObject.addClass("filtered");
      }
      else {
        // Remove elements from DOM
        selectObject.find("option[data-filter]").remove();
        selectObject.find("option[data-filter-emptyvalue]").remove();
      }

      // Get filtered elements.
      var toEnable = fullData.filter("option[data-filter][data-filter='" + filterValue + "']");

      // Attach elements to DOM
      selectObject.append(toEnable);

      // If toEnable is empty, show empty option.
      if (toEnable.length == 0) {
        selectObject.append(emptyValue);
      }

      // Select First Occurrence
      if (autoSelect) {
        var obj = selectObject.find("option[selected]");
        selectObject.val(obj.length == 0 ? toEnable.val() : obj.val());
      }
    };


    /**
     * Valida un string de correo electronico.
     * @param email
     * @returns {boolean}
     */
    _Utils.isValidEmail = function (email) {
      return _Utils.isValidString(email) && REGEX_EMAIL.test(email);
    };

    /**
     * Valida un string de RUT o RUN chileno.
     * Permite valores con o sin separador de miles (solo '.') y con y sin guion separando
     * el digito verificador.
     *
     * @param rut string.
     * @returns {boolean}
     */
    _Utils.isValidRUT = function (rut) {
      return _Utils.RUTUtils.isValidRut(rut);
    };

    /**
     * Valida un numero telefonico.
     * Debe tener length >= 10, comenzar con + y contener solo
     * numeros.
     *
     * @param value string.
     * @returns {boolean}
     */
    _Utils.isValidPhoneNumber = function (value) {
      var phone = value.replace(/[^0-9\+]/g, "").trim();
      return _Utils.isValidString(phone)
        && phone.length >= 10
        && phone.startsWith("+")
        && phone.substring(1).match("[0-9]+");
    };

    /**
     * Formatea un numero telefonico.
     * Si length == 8 se le agregara 569
     * Si length == 9 se le agregara 56
     * Si no comienza con + se le agregara un +
     *
     * @param value string.
     * @returns {string}
     */
    _Utils.formatPhoneNumber = function (value) {
      var p = value.replace(/[^0-9]/g, "").trim();

      var CL_PHONE_CODE = "56";
      var CL_MOBILE_CODE = "9";

      // Normalizar por numeros celulares chilenos
      if(p.length === 8) {
        p = "+" + CL_PHONE_CODE + CL_MOBILE_CODE + p;
      }
      else if (p.length === 9) {
        p = "+" + CL_PHONE_CODE + p;
      }
      else if (p.length >= 10) {
        p = "+" + p;
      }

      return p;
    };

    /**
     * Validates if a variable is undefined or null.
     *
     * @param val Variable to evaluate
     * @returns {boolean} true if typeof val === undefined or if val == null.
     */
    _Utils.isUoN = function (val) {
      return typeof val === "undefined" || val === null;
    };

    /**
     * Validates if a variable is a String. The check makes sure that the variable is
     * not undefined nor null and that typeof === string.
     * isString("") will return true.
     * @param val
     * @returns {boolean}
     */
    _Utils.isString = function (val) {
      return !_Utils.isUoN(val) && typeof val === "string";
    };

    /**
     * Validates if a variable is an valid string. This method is exactly like #isString, but
     * checks also that the string is not empty.
     * Useful for validating input texts.
     * @param val
     * @returns {boolean}
     */
    _Utils.isValidString = function (val) {
      return _Utils.isString(val) && val.trim().length > 0;
    };

    /**
     * Validates a variable is a boolean. The check makes sure that the variable is
     * not undefined nor null and that typeof === boolean.
     * @returns {boolean}
     */
    _Utils.isBool = function (val) {
      return !_Utils.isUoN(val) && typeof val === "boolean";
    };

    /**
     * Validates if a variable is a number. Contrary to isNaN(): undefinded, "", false, and null deliver false.
     * @param val
     * @returns {boolean}
     */
    _Utils.isNumber = function (val) {
      return !_Utils.isUoN(val) && !isNaN(val);
    };

    /**
     * Validates if a variable is a function.
     * @param val
     * @returns {boolean}
     */
    _Utils.isFunction = function (val) {
      return !_Utils.isUoN(val) && typeof  val === "function";
    };

    /**
     * Validates if a variable is an object.
     * @param val
     * @returns {boolean}
     */
    _Utils.isObject = function (val) {
      return !_Utils.isUoN(val) && typeof  val === "object";
    };

    /**
     * Timer repetitivo.
     * @param Function Callback function to call when triggered.
     * @return Object Timer object.
     * @constructor
     */
    _Utils.Timer = function (callback) {
      var _callback = callback;
      var _timeoutID = null;

      /**
       * Activa este timer, reseteando el tiempo si ya esta activado.
       * @param time Tiempo de espera en milisegundos.
       */
      this.set = function (time) {
        if (_timeoutID != null) {
          clearTimeout(_timeoutID);
          _timeoutID = null;
        }

        _timeoutID = setTimeout(_callback, time);
      };

      /**
       * Desactiva el Timer.
       */
      this.clear = function () {
        clearTimeout(_timeoutID);
      };

    };


    /**
     * Handler generico para formularios.
     *
     * Permite realizar operaciones genericas en formularios estandarizados, como obtener campos, marcar errores,
     * resetear estado, etc.
     * El formulario debe definir el atributo 'name' para cada componente y el valor de este atributo para el boton
     * submit debe ser 'submitButton'
     *
     * <b>Instanciar siempre con new:</b>
     * <code>var handler = new Utils.FormHandler($("#formID"));
     *
     * @param {JQuery} formJQueryObject Objeto
     * @constructor
     */
    _Utils.FormHandler = function (formJQueryObject) {

      var form = formJQueryObject;
      var errorFound = false;

      // Helper functions

      /**
       * Gets the form object.
       * @returns {JQuery}
       */
      this.getForm = function () {
        return form;
      };

      /**
       * Indicates if the jQuery Object has elements.
       * @returns {boolean}
       */
      this.exists = function () {
        return !Utils.isUoN(form) && form.length > 0;
      };

      /**
       * Obtiene el campo del formulario cuyo nombre es el especificado.
       *
       * @param {String} name nombre del campo a obtener segun el atributo 'name'.
       * @returns {JQuery}
       */
      this.getField = function (name) {
        return form.find("[name='" + name + "']");
      };

      /** Disables/Enables submit button */
      this.disableButton = function (disable, buttonName) {
        var butname = !Utils.isString(buttonName) ? "submitButton" : buttonName;
        this.getField(butname).prop("disabled", disable);
      };

      /** Signal errors in a form field */
      this.markError = function (object) {
        object.addClass("errorInput");
        errorFound = true;
      };

      /**
       * Validates the element as a text input and marks input as error if not validated.
       * @param element
       * @return {boolean}
       */
      this.validateTextInput = function (element) {
        if (!Utils.isValidString(element.val())) {
          this.markError(element);
          return false;
        }
        else {
          return true;
        }
      };

      /**
       * Resets form state.
       */
      this.clearButtonState = function () {
        // Re-enable button.
        this.disableButton(false);
      };

      /**
       * Indica si se han marcado errores en el formulario.
       * @return {boolean}
       */
      this.errorFound = function () {
        return errorFound == true;
      };


      /**
       * Elimina los errores marcados en el formulario.
       */
      this.resetErrors = function () {
        form.find("*").removeClass("errorInput");
        errorFound = false;
      };

      /**
       * Resetea el formulario a su estado inicial.
       */
      this.reset = function () {
        form.trigger("reset");
        this.resetErrors();
      };

      /**
       * Exporta todos los controles del formulario en un objeto JSON, con excepcion
       * de los botones.
       */
      this.saveToObject = function () {
        var newObj = {};
        var all_elements = form.find('[name]').filter(":input:not(:button)");

        // Caso Ratio group sin seleccion.
        var uncheckedRatios = all_elements.filter(":radio:not(:checked)");
        uncheckedRatios.each(function (index, element) {
          newObj[element.name] = null;
        });

        // Checkbox case
        var checkboxes = all_elements.filter(":checkbox");
        checkboxes.each(function (index, element) {
          newObj[element.name] = $(element).is(":checked");
        });

        // Write values
        var input_elements = all_elements.filter(":not(:radio:not(:checked)):not(:checkbox)");
        input_elements.each(function (index, element) {
          newObj[element.name] = element.value;
        });
        return newObj;
      };

      /**
       * Carga la data del objeto entregado en los controles del formulario.
       * Se asume que el objeto entregado fue generado por el metodo saveToObject,
       * o tiene un formato equivalente.
       * @param object
       */
      this.loadFromObject = function (object) {
        var key;
        for (key in object) {
          if (object.hasOwnProperty(key)) {
            var field = this.getField(key);

            // Load depending on type.
            // Radio type
            if (field.is(":radio")) {
              if (Utils.isUoN(object[key])) {
                field.prop('checked', false).change();
              }
              else {
                field.filter("[value='" + object[key] + "']").prop('checked', true).change();
              }
            }

            // Checkbox.
            else if (field.is(":checkbox")) {
              var selected = (object[key] || object[key] == "true");
              field.prop('checked', selected).change();
            }

            // Standard text Field
            else {
              field.val(_Utils.unescapeHtml(object[key])).change();
            }
          }
        }
      }
    };


    /**
     * Handler utilitario para tablas html.
     *
     * Permite realizar operaciones genericas en tablas, como filtrado, etc.
     *
     * <code>var handler = Utils.TableHandler($("#formID"));
     *
     * @param {JQuery} tableJQueryObject Objeto
     */
    _Utils.TableHandler = function (tableJQueryObject) {

      var ROW_SELECTOR = "tbody > tr";

      var _table_handler = {};
      var table = tableJQueryObject;

      /**
       * @return {JQuery}
       */
      var allRows = function () {
        return table.find(ROW_SELECTOR);
      };


      /**
       * Filter a table, showing only rows which contain searchText on its innerText.
       *
       * @param {string} searchText
       */
      _table_handler.filterRowsByText = function (searchText) {
        if (!_Utils.isValidString(searchText)) {
          _table_handler.removeRowFilters();
          return;
        }
            console.log("fl" + searchText);

        allRows().each(function () {
          var element = $(this);
          if (Utils.stringContains(element.text(), searchText)) {
            element.show();
            console.log("show")
          } else {
            element.hide();
            console.log("hide")
          }
        });
      };

      /**
       * Displays all hidden rows of this table.
       */
      _table_handler.removeRowFilters = function () {
        allRows().show();
      };

      return _table_handler;
    };




    /**
     * Utilidades para la validacion de RUT Chileno.
     */
    _Utils.RUTUtils = (function () {

      var _RUTUtils = {};

      /** Expresion regular para evaluacion de RUT. */
      _RUTUtils.REGEX_RUT = /^0*(\d{1,3}(\.?\d{3})*)-?([\dkK])$/;

      /**
       * Elimina formato del string rut.
       */
      _RUTUtils.clearFormat = function (value) {
        return value.replace(/[\.\-]/g, "").trim().toLowerCase();
      };

      _RUTUtils.splitRutAndDv = function (rut) {
        var cValue = _RUTUtils.clearFormat(rut);
        if (cValue.length === 0 || cValue.length === 1) {
          return null;
        }
        var cDv = cValue.charAt(cValue.length - 1);
        var cRut = cValue.substring(0, cValue.length - 1);
        return [cRut, cDv];
      };

      /**
       * Formatea un RUT a XX.XXX.XXX-K
       *
       * @param value
       * @param noThousandsSeparator Si es true, no agregara un . como separador decimal.
       * @return {*}
       */
      _RUTUtils.format = function (value, noThousandsSeparator) {
        var rutAndDv = _RUTUtils.splitRutAndDv(value);
        var cRut = rutAndDv[0];
        var cDv = rutAndDv[1];
        if (!(cRut && cDv)) {
          return cRut || value;
        }
        var rutF = "";
        var thousandsSeparator = noThousandsSeparator ? "" : ".";
        while (cRut.length > 3) {
          rutF = thousandsSeparator + cRut.substr(cRut.length - 3) + rutF;
          cRut = cRut.substring(0, cRut.length - 3);
        }
        return cRut + rutF + "-" + cDv;
      };


      /**
       * Valida si el rut es correcto.
       */
      _RUTUtils.isValidRut = function (rut) {
        if (typeof(rut) !== 'string') {
          return false;
        }

        if (!_RUTUtils.REGEX_RUT.test(rut)) {
          return false;
        }

        var cRut = _RUTUtils.clearFormat(rut);

        var cDv = cRut.charAt(cRut.length - 1).toUpperCase();
        var nRut = parseInt(cRut.substr(0, cRut.length - 1));
        if (isNaN(nRut)) {
          return false;
        }
        return _RUTUtils.computeDv(nRut).toString().toUpperCase() === cDv;
      };

      /**
       * Calcula el digito verificador de un rut.
       * @param rut sin digito verificador.
       * @return {*}
       */
      _RUTUtils.computeDv = function (rut) {
        var suma = 0;
        var mul = 2;
        if (typeof(rut) !== 'number') {
          return;
        }
        rut = rut.toString();
        for (var i = rut.length - 1; i >= 0; i--) {
          suma = suma + rut.charAt(i) * mul;
          mul = ( mul + 1 ) % 8 || 2;
        }
        switch (suma % 11) {
          case 1  :
            return 'k';
          case 0  :
            return 0;
          default  :
            return 11 - (suma % 11);
        }
      };

      /**
       * Formatea el valor de un elemento html.
       * @param element Elemento a formatear.
       */
      _RUTUtils.inputFormat = function (element) {
        var e = $(element);
        e.val(_RUTUtils.format(e.val()));
      };

      /**
       * Elimina el formato del valor de un elemento html.
       * @param element Elemento a formatear.
       */
      _RUTUtils.clearInputFormat = function (element) {
        var e = $(element);
        e.val(_RUTUtils.clearFormat(e.val()));
      };

      // FIN RUT UTILS
      return _RUTUtils;
    })();


    /*
     FIN UTILS.
     */

    return _Utils;
  }

//define globally if it doesn't already exist
  if (typeof(window.Utils) === 'undefined') {
    window.Utils = _XT_Utils_Initializer();
    console.log("Loaded utility library");
  }
  else {
    console.log("Utils Library already defined.");
    throw "FATAL: Error initializing application: A component named 'Utils' already exists.";
  }
})(window);
