// Base Control Class
class BaseControl {
  constructor(x, y, width, height, label = '') {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.label = label;
    this.isHovered = false;
    this.isSelected = false;
    this.isUnavailable = false;
    this.visible = true;
  }
  
  // Standardized hit detection
  containsPoint(point) {
    return this.visible && 
           point.x >= this.x && point.x <= this.x + this.width &&
           point.y >= this.y && point.y <= this.y + this.height;
  }
  
  // Standardized background rendering
  drawBackground(ctx) {
    if (!this.visible) return;
    
    ctx.fillStyle = UI_STYLES.getControlBackground(
      this.isHovered, 
      this.isSelected, 
      this.isUnavailable
    );
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Draw border
    ctx.strokeStyle = UI_THEME.colours.border;
    ctx.lineWidth = UI_THEME.borders.medium;
    ctx.strokeRect(this.x, this.y, this.width, this.height);
  }
  
  // Standardized text rendering
  drawText(ctx, text, offsetX = 0, offsetY = 0) {
    if (!this.visible) return;
    
    ctx.fillStyle = UI_STYLES.getTextColour(this.isHovered, this.isUnavailable);
    ctx.font = `${UI_THEME.fonts.sizes.normal}px ${UI_THEME.fonts.primary}`;
    
    // Center text by default
    const textWidth = ctx.measureText(text).width;
    const textX = this.x + (this.width - textWidth) / 2 + offsetX;
    const textY = this.y + (this.height / 2) + 4 + offsetY; // +4 for baseline
    
    ctx.fillText(text, textX, textY);
  }
  
  // Standardized label rendering (above control)
  drawLabel(ctx) {
    if (!this.visible || !this.label) return;
    
    ctx.fillStyle = UI_THEME.colours.text.primary;
    ctx.font = `${UI_THEME.fonts.sizes.normal}px ${UI_THEME.fonts.primary}`;
    ctx.globalAlpha = 0.7;
    ctx.fillText(this.label, this.x, this.y - 8);
    ctx.globalAlpha = 1;
  }
  
  // Override these in subclasses
  handleClick() { return false; }
  handleMouseMove() { 
    this.isHovered = this.containsPoint(pointerPos);
  }
  update() {
    // Override in subclasses
  }
  render(ctx) {
    this.drawBackground(ctx);
    this.drawLabel(ctx);
  }
}

// Event handling utility that both ui.js and editor.js can use
class ControlManager {
  constructor() {
    this.controls = [];
  }
  
  add(control) {
    this.controls.push(control);
  }
  
  remove(control) {
    const index = this.controls.indexOf(control);
    if (index > -1) this.controls.splice(index, 1);
  }
  
  handleMouseMove() {
    let handled = false;
    for (const control of this.controls) {
      control.handleMouseMove();
      if (!handled && control.isHovered) {
        handled = true;
      }
    }
    return handled;
  }
  
  handleClick() {
    for (const control of this.controls) {
      if (control.containsPoint(pointerPos) && control.handleClick()) {
        return true;
      }
    }
    return false;
  }
  
  render(ctx) {
    for (const control of this.controls) {
      control.render(ctx);
    }
  }
  
  update() {
    for (const control of this.controls) {
      control.update();
    }
  }
}