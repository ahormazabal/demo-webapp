package com.variacode.glennmm.core.web;

import com.variacode.glennmm.MainApplication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

  private final MainApplication mainApplication;

  @Autowired
  public MainController(MainApplication mainApplication) {
    this.mainApplication = mainApplication;
    
  }

  @GetMapping("/")
  public String main(Model model) {
    model.addAttribute("version", mainApplication.getApplicationVersion());
    return "main.html";
  }


}
