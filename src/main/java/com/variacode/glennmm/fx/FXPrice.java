package com.variacode.glennmm.fx;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.variacode.glennmm.ApplicationConstants;
import com.variacode.glennmm.fx.impl.usdclp.MindicadorUSDCLP;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

public class FXPrice {

    private static final Logger LOG = LoggerFactory.getLogger(FXPrice.class);

    private static final RestTemplate template = (new RestTemplateBuilder()).build();

    //Key symbol-date
    private static final LoadingCache<String, BigDecimal> FX_PRICE =
            CacheBuilder.newBuilder()
                    //.maximumSize(100)
                    .expireAfterAccess(1, TimeUnit.HOURS)
                    .build(new CacheLoader<>() {  // build the cacheloader

                        @Override
                        public BigDecimal load(String empId) {
                            if ("USDCLP".equals(empId)) {
                                final MindicadorUSDCLP usdclp =
                                        template.getForObject("https://mindicador.cl/api/dolar", MindicadorUSDCLP.class);

                                return usdclp.getSerie().get(0).getValor();
                            } else if ("CLPUSD".equals(empId)) {
                                final MindicadorUSDCLP usdclp =
                                        template.getForObject("https://mindicador.cl/api/dolar", MindicadorUSDCLP.class);

                                return BigDecimal.ONE.divide(usdclp.getSerie().get(0).getValor(), ApplicationConstants.DEFAULT_MATH_CONTEXT);
                            } else if ("DAICLP".equals(empId)) { //TODO ESTO NO ES CORRECTO, preguntar a los OrionX que hacer
                                final MindicadorUSDCLP usdclp =
                                        template.getForObject("https://mindicador.cl/api/dolar", MindicadorUSDCLP.class);

                                return usdclp.getSerie().get(0).getValor();
                            } else if ("CLPDAI".equals(empId)) {
                                final MindicadorUSDCLP usdclp =
                                        template.getForObject("https://mindicador.cl/api/dolar", MindicadorUSDCLP.class);

                                return BigDecimal.ONE.divide(usdclp.getSerie().get(0).getValor(), ApplicationConstants.DEFAULT_MATH_CONTEXT);
                            }
                            return null;
                        }
                    });

    public static BigDecimal getSymbolLastPrice(final String symbol) {
        try {
            return FX_PRICE.get(symbol);
        } catch (ExecutionException e) {
            LOG.error("Error getting FX Price: " + e.getMessage(), e);
            return null;
        }
    }

}
