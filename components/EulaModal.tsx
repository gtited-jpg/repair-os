import React from 'react';
import Panel from './GlassPanel';
import Icon from './Icon';

interface EulaModalProps {
  onClose: () => void;
}

const EulaModal: React.FC<EulaModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <Panel className="w-full max-w-2xl max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <header className="p-6 flex justify-between items-center border-b border-dc-border">
          <h2 className="text-2xl font-bold text-dc-text-primary">End-User License Agreement (EULA)</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-dc-hover">
            <Icon name="close" className="w-6 h-6" />
          </button>
        </header>
        
        <div className="flex-1 p-6 overflow-y-auto space-y-4 text-sm text-dc-text-secondary">
            <p>This End-User License Agreement ("EULA") is a legal agreement between you and DAEMONCORE Inc. for the DAEMONCORE Repair OS software product ("Software").</p>
            
            <h3 className="font-bold text-dc-text-primary pt-2">1. GRANT OF LICENSE</h3>
            <p>DAEMONCORE grants you a revocable, non-exclusive, non-transferable, limited license to download, install and use the Software solely for your personal, non-commercial purposes strictly in accordance with the terms of this Agreement.</p>

            <h3 className="font-bold text-dc-text-primary pt-2">2. RESTRICTIONS</h3>
            <p>You agree not to, and you will not permit others to license, sell, rent, lease, assign, distribute, transmit, host, outsource, disclose or otherwise commercially exploit the Software or make the Software available to any third party.</p>

            <h3 className="font-bold text-dc-text-primary pt-2">3. INTELLECTUAL PROPERTY</h3>
            <p>The Software, including without limitation all copyrights, patents, trademarks, trade secrets and other intellectual property rights are, and shall remain, the sole and exclusive property of DAEMONCORE Inc.</p>

            <h3 className="font-bold text-dc-text-primary pt-2">4. YOUR DATA</h3>
            <p>The Software collects and stores customer, inventory, and financial data. You are solely responsible for the accuracy and legality of this data. DAEMONCORE Inc. is not responsible for any data loss or corruption.</p>

            <h3 className="font-bold text-dc-text-primary pt-2">5. TERM AND TERMINATION</h3>
            <p>This Agreement shall remain in effect until terminated by you or DAEMONCORE Inc. DAEMONCORE Inc. may, in its sole discretion, at any time and for any or no reason, suspend or terminate this Agreement with or without prior notice.</p>
            
            <h3 className="font-bold text-dc-text-primary pt-2">6. DISCLAIMER OF WARRANTY</h3>
            <p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.</p>
        </div>
        
        <footer className="p-6 flex justify-end space-x-4 border-t border-dc-border bg-dc-panel/50 rounded-b-2xl">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-dc-purple font-semibold hover:bg-dc-purple/80">Close</button>
        </footer>
      </Panel>
    </div>
  );
};

export default EulaModal;