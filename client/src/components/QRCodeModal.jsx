import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Copy, Check, ExternalLink } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';

export default function QRCodeModal({ isOpen, onClose, link }) {
  const [copied, setCopied] = React.useState(false);

  if (!link) return null;

  const shortUrl = `${window.location.origin}/r/${link.shortCode}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDownloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `qr-${link.shortCode}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Short Link QR Code" maxWidth="max-w-sm">
      <div className="text-center">
        {/* QR Code Container styled with Crisp White & Dark Contrast */}
        <div className="bg-white p-6 rounded-3xl inline-block shadow-xl border border-gray-100 mx-auto my-3">
          <QRCodeSVG
            id="qr-code-svg"
            value={shortUrl}
            size={200}
            bgColor="#FFFFFF"
            fgColor="#222124"
            level="H"
            includeMargin={false}
          />
        </div>

        <div className="mt-4 mb-6">
          <h4 className="font-bold text-white text-base">/{link.shortCode}</h4>
          <p className="text-gray-400 text-xs truncate max-w-xs mx-auto mt-1" title={link.destinationUrl}>
            {link.destinationUrl}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleCopyLink}
            className="w-full justify-center"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-400" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy URL
              </>
            )}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleDownloadQR}
            className="w-full justify-center"
          >
            <Download className="w-4 h-4" /> Save PNG
          </Button>
        </div>
      </div>
    </Modal>
  );
}
