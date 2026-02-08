from playwright.sync_api import sync_playwright, expect
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Listen for console logs
        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))
        page.on("pageerror", lambda err: print(f"Browser Error: {err}"))

        try:
            # Navigate to the app
            page.goto("http://localhost:3000")

            # Wait for app to initialize (canvas present)
            page.wait_for_selector("#c", timeout=5000)

            # Click Save Scene button
            save_btn = page.get_by_text("Save Scene")
            save_btn.click()

            # Wait for any toast
            try:
                page.wait_for_selector(".toast", timeout=5000)
                print("Toast found!")
            except:
                print("No toast found")

            # Take screenshot
            page.screenshot(path="verification/toast_debug.png")
            print("Screenshot saved to verification/toast_debug.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
