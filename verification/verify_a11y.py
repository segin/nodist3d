from playwright.sync_api import sync_playwright

def verify(page):
    print("Navigating...")
    page.goto("http://localhost:3000")

    print("Waiting for load...")
    page.wait_for_load_state("networkidle")

    # Move Scene Graph panel to avoid overlap
    print("Moving Scene Graph panel...")
    page.evaluate("document.getElementById('scene-graph-panel').style.right = '300px'")

    print("Adding box...")
    page.get_by_text("Add Box").click()

    print("Waiting for Box_1...")
    page.wait_for_selector("#scene-graph-panel li:has-text('Box_1')")

    li = page.locator("#scene-graph-panel li:has-text('Box_1')").first

    role = li.get_attribute('role')
    tabindex = li.get_attribute('tabindex')
    aria_label = li.get_attribute('aria-label')

    print(f"LI Role: {role}")
    print(f"LI Tabindex: {tabindex}")
    print(f"LI Aria-Label: {aria_label}")

    btns = li.locator("button")

    vis_btn = btns.nth(0)
    del_btn = btns.nth(1)

    vis_aria = vis_btn.get_attribute('aria-label')
    vis_title = vis_btn.get_attribute('title')

    del_aria = del_btn.get_attribute('aria-label')
    del_title = del_btn.get_attribute('title')

    print(f"Vis Button Aria-Label: {vis_aria}")
    print(f"Vis Button Title: {vis_title}")

    print(f"Del Button Aria-Label: {del_aria}")
    print(f"Del Button Title: {del_title}")

    page.screenshot(path="verification/verification.png")
    print("Screenshot saved.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()
