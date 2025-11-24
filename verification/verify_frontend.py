
from playwright.sync_api import sync_playwright
import time

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda err: console_errors.append(str(err)))

        try:
            page.goto("http://localhost:3000")
            # Wait for scene to load
            page.wait_for_selector("canvas", state="visible")
            # Wait a bit for any startup scripts to run
            time.sleep(2)

            # Check for module errors
            module_errors = [err for err in console_errors if "Module not found" in err or "404" in err]

            if module_errors:
                print("FAILED: Module errors found:")
                for err in module_errors:
                    print(f"- {err}")
                exit(1)
            else:
                print("SUCCESS: No module errors found.")

            page.screenshot(path="verification/verification.png")

        except Exception as e:
            print(f"FAILED: {e}")
            exit(1)
        finally:
            browser.close()

if __name__ == "__main__":
    verify_frontend()
